import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarA } from '../../components/navbar-a/navbar-a';
import { Footer } from '../../components/footer/footer';
import { Habitacion as HabitacionService } from '../../services/habitacion';
import { TipoHabitacion as TipoHabitacionService } from '../../services/tipo-habitacion';
import { Habitacion } from '../../interfaces/habitacion';
import { TipoHabitacion } from '../../interfaces/tipo-habitacion';

@Component({
  selector: 'app-a-habitaciones',
  imports: [CommonModule, FormsModule, Navbar, NavbarA, Footer],
  templateUrl: './a-habitaciones.html',
  styleUrl: './a-habitaciones.css',
})
export class AHabitaciones implements OnInit {

  constructor(private cd: ChangeDetectorRef, private habitacionservice: HabitacionService, private tipohabitacionservice: TipoHabitacionService) { }

  tiposHabitacion: TipoHabitacion[] = [];
  habitaciones: Habitacion[] = [];
  loadingTipos = true;
  loadingHabitaciones = true;
  errorTipos: string | null = null;
  errorHabitaciones: string | null = null;
  isSubmittingTipo = false;
  isSubmittingHabitacion = false;

  activeView: 'tipos' | 'habitaciones' = 'tipos';

  nuevoTipo = { nombre: '', descripcion: '', capacidad_max: '', precio_x_dia: 0, estado: true };
  nuevaHabitacion = { id_thabitacion: '' as number | '', numero: '', estado: true };

  message = '';
  isSuccess = false;
  showMessage = false;
  private toastTimeout: any;

  ngOnInit(): void {
    this.cargarTipos();
    this.cargarHabitaciones();
  }

  showCustomMessage(text: string, success: boolean): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.message = text;
    this.isSuccess = success;
    this.showMessage = true;

    this.toastTimeout = setTimeout(() => {
      this.showMessage = false;
    }, 4000);
  }

  cargarTipos(): void {
    this.loadingTipos = true;
    this.errorTipos = null;

    this.tipohabitacionservice.get_tiposHabitacion().subscribe({

      next: (data) => {
        this.tiposHabitacion = data.data || [];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando tipos:', err);
        this.errorTipos = 'No se pudieron cargar los tipos de habitación.';
        this.cd.detectChanges();
      },
      complete: () => {
        this.loadingTipos = false;
        this.cd.detectChanges();
      }
    });
  }

  guardarTipo(): void {
    if (!this.nuevoTipo.nombre || !this.nuevoTipo.capacidad_max) {
      this.showCustomMessage('Por favor, complete el nombre y la capacidad máxima.', false);
      return;
    }

    if (this.isSubmittingTipo) return;

    this.isSubmittingTipo = true;
    this.tipohabitacionservice.create_tipoHabitacion(this.nuevoTipo).subscribe({

      next: () => {
        this.showCustomMessage(
          `Tipo "${this.nuevoTipo.nombre}" creado exitosamente.`,
          true
        );
        this.nuevoTipo = {
          nombre: '',
          descripcion: '',
          capacidad_max: '',
          precio_x_dia: 0,
          estado: true
        };
        this.cargarTipos();
      },
      error: (err) => {
        console.error('Error creando tipo:', err);
        this.showCustomMessage('Error al crear el tipo de habitación.', false);
      },
      complete: () => {
        this.isSubmittingTipo = false;
        this.cd.detectChanges();
      }
    });
  }

  cargarHabitaciones(): void {
    this.loadingHabitaciones = true;
    this.errorHabitaciones = null;
    this.habitacionservice.getHabitaciones().subscribe({

      next: (data: any) => {
        this.habitaciones = data.data || [];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando habitaciones:', err);
        this.errorHabitaciones = 'No se pudieron cargar las habitaciones.';
        this.cd.detectChanges();
      },
      complete: () => {
        this.loadingHabitaciones = false;
        this.cd.detectChanges();
      }
    });
  }

  guardarHabitacion(): void {
    if (!this.nuevaHabitacion.id_thabitacion || !this.nuevaHabitacion.numero) {
      this.showCustomMessage('Por favor, seleccione el tipo y el número de habitación.', false);
      return;
    }

    if (this.isSubmittingHabitacion) return;

    this.isSubmittingHabitacion = true;
    this.habitacionservice.createHabitacion(this.nuevaHabitacion).subscribe({

      next: () => {

        this.showCustomMessage(`Habitación ${this.nuevaHabitacion.numero} registrada.`, true);

        this.nuevaHabitacion = {
          id_thabitacion: '',
          numero: '',
          estado: true
        };

        this.cargarHabitaciones();
      },
      error: (err) => {
        console.error('Error creando habitación:', err);
        this.showCustomMessage('Error al registrar la habitación.', false);
      },
      complete: () => {
        this.isSubmittingHabitacion = false;
        this.cd.detectChanges();
      }
    });
  }

  toggleEstado(h: Habitacion): void {
    const nuevo = h.limpieza === true ? false : true;
    const nuevoEstadoTexto = nuevo === true ? 'LIMPIA' : 'SUCIA';

    this.habitacionservice.updateLimpieza(h.id_habitacion).subscribe({

      next: () => {
        this.showCustomMessage(
          `Habitación ${h.numero} marcada como ${nuevoEstadoTexto}.`,
          true
        );
        this.cargarHabitaciones();
      },
      error: (err) => {
        console.error('Error actualizando estado:', err);
        this.showCustomMessage('Error al actualizar el estado.', false);
      }
    });
  }

  getNombreTipo(id_thabitacion: number): string {
    return this.tiposHabitacion.find(t => t.id_thabitacion === id_thabitacion)?.nombre ?? '—';
  }

  getTiposActivos(): number {
    return this.tiposHabitacion.filter(t => t.estado === true).length;
  }

  getHabitacionesLimpias(): number {
    return this.habitaciones.filter(h => h.limpieza === true).length;
  }
}
