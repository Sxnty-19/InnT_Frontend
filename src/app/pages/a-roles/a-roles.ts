import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarA } from '../../components/navbar-a/navbar-a';
import { Footer } from '../../components/footer/footer';
import { Rol as RolService } from '../../services/rol';
import { ModuloRol as ModuloRolService } from '../../services/modulo-rol';
import { Modulo as ModuloService } from '../../services/modulo';
import { Rol } from '../../interfaces/rol';
import { Modulo } from '../../interfaces/modulo';
import { ModuloAsignado } from '../../interfaces/modulo-rol';

@Component({
  selector: 'app-a-roles',
  imports: [CommonModule, FormsModule, Navbar, NavbarA, Footer],
  templateUrl: './a-roles.html',
  styleUrl: './a-roles.css',
})
export class ARoles implements OnInit {

  constructor(
    private rolService: RolService,
    private moduloService: ModuloService,
    private moduloRolService: ModuloRolService,
    private cd: ChangeDetectorRef
  ) { }

  roles: Rol[] = [];
  modulos: Modulo[] = [];
  assignedModules: ModuloAsignado[] = [];

  cargandoRoles = false;
  cargandoModulos = false;
  cargandoAsignados = false;
  creandoRol = false;
  assigningBusy = false;
  errorMsg = '';

  nuevoRol = { nombre: '', descripcion: '', estado: true };

  showCreateModal = false;
  showAssignModal = false;
  currentRole: Rol | null = null;
  selectedModuloToAssign: number | null = null;

  showConfirmModal = false;
  confirmMessage = '';
  confirmAction: () => void = () => { };

  message = '';
  isSuccess = false;
  showMessage = false;
  isModalActive = false;
  private toastTimeout: any;
  private fadeTimeout: any;

  ngOnInit(): void {
    this.cargarRoles();
    this.cargarModulos();
  }

  hideMessageWithTransition(duration = 300): Promise<void> {
    this.isModalActive = false;
    return new Promise(resolve => {
      if (this.fadeTimeout) clearTimeout(this.fadeTimeout);
      this.fadeTimeout = setTimeout(() => {
        this.showMessage = false;
        resolve();
      }, duration);
    });
  }

  async showFloatingMessage(type: 'success' | 'error', text: string): Promise<void> {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    if (this.showMessage) await this.hideMessageWithTransition(100);

    this.message = text;
    this.isSuccess = type === 'success';
    this.showMessage = true;
    this.isModalActive = true;

    this.toastTimeout = setTimeout(() => {
      this.hideMessageWithTransition(300);
    }, 4000);
  }

  hideNotification(): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.hideMessageWithTransition(300);
  }

  cargarRoles(): void {
    this.cargandoRoles = true;
    this.errorMsg = '';

    this.rolService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = res.data || res;
        this.cargandoRoles = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargandoRoles = false;
        this.cd.detectChanges();
      }
    });
  }

  crearRol(): void {
    if (!this.nuevoRol.nombre.trim()) {
      this.showFloatingMessage('error', 'El nombre del rol es obligatorio.');
      return;
    }

    this.creandoRol = true;

    this.rolService.createRol(this.nuevoRol).subscribe({
      next: () => {
        this.showCreateModal = false;
        this.nuevoRol = { nombre: '', descripcion: '', estado: true };
        this.cargarRoles();
        this.creandoRol = false;
      },
      error: (err) => {
        console.error(err);
        this.creandoRol = false;
      }
    });
  }

  handleToggleEstado(rol: Rol): void {
    const confirmMsg = rol.estado === true
      ? `¿Seguro que quieres DESACTIVAR el rol "${rol.nombre}"? Esto afectará a los usuarios asignados.`
      : `¿Seguro que quieres ACTIVAR el rol "${rol.nombre}"?`;

    this.confirmMessage = confirmMsg;
    this.confirmAction = async () => {
      this.showConfirmModal = false;
      await this.toggleEstadoRol(rol);
    };
    this.showConfirmModal = true;
  }

  toggleEstadoRol(rol: Rol): void {
    this.rolService.updateEstado(rol.id_rol).subscribe({
      next: () => this.cargarRoles(),
      error: (err) => console.error(err)
    });
  }

  cargarModulos(): void {
    this.cargandoModulos = true;

    this.moduloService.getModulos().subscribe({
      next: (res: any) => {
        this.modulos = res.data || res;
        this.cargandoModulos = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargandoModulos = false;
        this.cd.detectChanges();
      }
    });
  }

  cargarModulosAsignados(id: number): void {
    this.cargandoAsignados = true;

    this.moduloRolService.get_modulos_roles(id).subscribe({
      next: (res: any) => {
        this.assignedModules = res.data || res;
        this.cargandoAsignados = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargandoAsignados = false;
      }
    });
  }

  abrirModalAsignar(rol: Rol): void {
    this.currentRole = rol;
    this.selectedModuloToAssign = null;
    this.showAssignModal = true;
    this.cargarModulosAsignados(rol.id_rol);
  }

  handleAsignarModulo(): void {
    if (!this.currentRole) return;
    if (!this.selectedModuloToAssign) {
      this.showFloatingMessage('error', 'Selecciona un módulo para asignar.');
      return;
    }

    const moduloNombre = this.modulos.find(m => m.id_modulo == this.selectedModuloToAssign)?.nombre || 'Módulo Desconocido';

    this.confirmMessage = `¿Seguro que deseas ASIGNAR el módulo "${moduloNombre}" al rol "${this.currentRole.nombre}"?`;
    this.confirmAction = async () => {
      this.showConfirmModal = false;
      await this.asignarModulo();
    };
    this.showConfirmModal = true;
  }

  asignarModulo(): void {
    if (!this.currentRole || !this.selectedModuloToAssign) return;

    this.assigningBusy = true;

    const payload = {
      id_modulo: this.selectedModuloToAssign,
      id_rol: this.currentRole.id_rol,
      estado: 1,
    };

    this.moduloRolService.createModuloRol(payload).subscribe({
      next: () => {
        this.cargarModulosAsignados(this.currentRole!.id_rol);
        this.selectedModuloToAssign = null;
        this.assigningBusy = false;
      },
      error: (err) => {
        console.error(err);
        this.assigningBusy = false;
      }
    });
  }

  // ========================
  // HELPERS
  // ========================
  getRolesActivos(): number {
    return this.roles.filter(r => r.estado === true).length;
  }

  getNuevoRolEstado(): boolean { return this.nuevoRol.estado; }
  setNuevoRolEstado(val: string): void {
    this.nuevoRol.estado = val === 'true';
  }
}
