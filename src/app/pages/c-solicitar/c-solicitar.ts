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
  selector: 'app-c-solicitar',
  imports: [CommonModule, FormsModule, Navbar, NavbarA, Footer],
  templateUrl: './c-solicitar.html',
  styleUrl: './c-solicitar.css',
})
export class CSolicitar implements OnInit {

  constructor(private cd: ChangeDetectorRef, private solicitudservice: SolicitudService) { }

  solicitudes: SolicitudConHabitacion[] = [];
  error = '';
  isSubmitting = false;
  activeView: 'create' | 'history' = 'create';

  numeroHabitacion = '';
  descripcion = '';

  user: any = null;
  fullName = '';
  rol = '';

  message = '';
  isSuccess = false;
  showMessage = false;
  isModalActive = false;
  private toastTimeout: any;
  private fadeTimeout: any;

  ngOnInit(): void {
    this.cargarSolicitudes();
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

    if (this.showMessage) {
      await this.hideMessageWithTransition(100);
    }

    this.message = text;
    this.isSuccess = type === 'success';
    this.showMessage = true;
    this.isModalActive = true;

    this.toastTimeout = setTimeout(() => {
      this.hideMessageWithTransition(300);
    }, 4000);
  }

  cargarSolicitudes(): void {
    this.solicitudservice
      .get_solicitudes_usuario()
      .subscribe({

        next: (data) => {

          this.solicitudes = (data.data || []).sort(
            (a: SolicitudConHabitacion, b: SolicitudConHabitacion) =>
              b.id_solicitud - a.id_solicitud
          );
          this.cd.detectChanges();
        },

        error: (err) => {

          console.error(err);
          this.solicitudes = [];
          if (err.status && err.status >= 500) {
            this.error = 'Error del servidor al cargar solicitudes.';
          } else {
            this.error = '';
          }
          this.cd.detectChanges();
        }
      });
  }

  crearNotificacion(): void {
    if (!this.numeroHabitacion || !this.descripcion) {
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
      numero_habitacion: this.numeroHabitacion,
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
          `Solicitud creada correctamente para Habitación ${this.numeroHabitacion}!`
        );

        this.numeroHabitacion = '';
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
}
