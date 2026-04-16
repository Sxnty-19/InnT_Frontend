import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarA } from '../../components/navbar-a/navbar-a';
import { Footer } from '../../components/footer/footer';
import { Solicitud as SolicitudService } from '../../services/solicitud';
import { SolicitudConHabitacion } from '../../interfaces/solicitud';

@Component({
  selector: 'app-a-solicitudes',
  imports: [CommonModule, FormsModule, Navbar, NavbarA, Footer],
  templateUrl: './a-solicitudes.html',
  styleUrl: './a-solicitudes.css',
})
export class ASolicitudes implements OnInit {
  solicitudes: SolicitudConHabitacion[] = [];
  loading = true;
  error: string | null = null;
  isSubmitting = false;
  activeView: 'create' | 'history' = 'create';

  numero_habitacion = '';
  descripcion = '';

  message = '';
  isSuccess = false;
  showMessage = false;
  isModalActive = false;
  private toastTimeout: any;
  private fadeTimeout: any;

  constructor(private cd: ChangeDetectorRef, private solicitudservice: SolicitudService) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  hideMessageWithTransition(duration = 300): Promise<void> {
    this.isModalActive = false;
    return new Promise(resolve => {
      this.fadeTimeout = setTimeout(() => {
        this.showMessage = false;
        resolve();
      }, duration);
    });
  }

  showFloatingMessage(type: 'success' | 'error', text: string): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    if (this.fadeTimeout) clearTimeout(this.fadeTimeout);

    if (this.showMessage) {
      this.hideMessageWithTransition(100);
    }

    this.message = text;
    this.isSuccess = type === 'success';
    this.showMessage = true;
    this.isModalActive = true;

    this.toastTimeout = setTimeout(() => { this.hideMessageWithTransition(300); }, 4000);
  }

  cargarSolicitudes(): void {

    this.loading = true;
    this.error = null;

    this.solicitudservice.get_solicitudes().subscribe({

      next: (res: any) => {

        const data = res?.data || [];

        this.solicitudes = data.sort(
          (a: SolicitudConHabitacion, b: SolicitudConHabitacion) =>
            b.id_solicitud - a.id_solicitud
        );
        this.loading = false;
        this.cd.detectChanges();
      },

      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar las solicitudes.';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  crearSolicitud(): void {
    if (!this.numero_habitacion || !this.descripcion) {
      this.showFloatingMessage(
        'error',
        'Por favor, complete el número de habitación y la descripción.'
      );
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = '';

    const payload = {
      numero_habitacion: this.numero_habitacion,
      descripcion: this.descripcion,
      estado: true
    };

    this.solicitudservice.create_solicitud_habitacion(payload).subscribe({

      next: async (data) => {

        if (!data.success) {

          this.showFloatingMessage(
            'error',
            data.detail ?? 'Error al crear solicitud.'
          );
          return;
        }

        this.showFloatingMessage(
          'success',
          `Solicitud creada correctamente para Habitación ${this.numero_habitacion}!`
        );

        this.numero_habitacion = '';
        this.descripcion = '';
        this.cargarSolicitudes();
        this.activeView = 'history';
      },

      error: () => {

        this.error = 'Error de conexión con el servidor.';

        this.showFloatingMessage(
          'error',
          'Error de conexión con el servidor. Intente de nuevo.'
        );
      },

      complete: () => {
        this.isSubmitting = false;
        this.cd.detectChanges();
      }
    });
  }

  terminarSolicitud(id_solicitud: number) {
    const confirmar = confirm("¿Seguro que deseas terminar esta solicitud?");

    if (!confirmar) return;

    this.solicitudservice.update_solicitud(id_solicitud).subscribe({
      next: () => {
        alert("Solicitud terminada correctamente");
        this.cargarSolicitudes();
        this.cd.detectChanges();
      },

      error: (err) => {
        console.error(err);
        alert(err.error.detail || "Error al terminar solicitud");
      }
    });
  }
}
