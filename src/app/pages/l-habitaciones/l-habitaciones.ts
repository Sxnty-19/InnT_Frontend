import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarA } from '../../components/navbar-a/navbar-a';
import { Footer } from '../../components/footer/footer';
import { Habitacion as HabitacionService } from '../../services/habitacion';
import { Habitacion } from '../../interfaces/habitacion';

@Component({
  selector: 'app-l-habitaciones',
  imports: [CommonModule, Navbar, NavbarA, Footer],
  templateUrl: './l-habitaciones.html',
  styleUrl: './l-habitaciones.css',
})
export class LHabitaciones implements OnInit {

  constructor(private cd: ChangeDetectorRef, private habitacionservice: HabitacionService) { }

  habitaciones: Habitacion[] = [];
  loading = true;
  error: string | null = null;

  message = '';
  isSuccess = false;
  showMessage = false;
  private toastTimeout: any;

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  getPendientes(): number {
    return this.habitaciones.filter(h => !h.limpieza).length;
  }

  showNotification(msg: string, success: boolean, duration = 3000): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);

    this.showMessage = false;
    this.message = msg;
    this.isSuccess = success;

    setTimeout(() => {
      this.showMessage = true;
      this.toastTimeout = setTimeout(() => {
        this.showMessage = false;
      }, duration);
    }, 50);
  }

  cargarHabitaciones(): void {

    this.loading = true;
    this.error = null;

    this.habitacionservice.getHabitaciones().subscribe({

      next: (data: any) => {

        if (!data.success) {
          throw new Error(data.detail ?? 'Error al cargar.');
        }

        this.habitaciones = data.data.sort(
          (a: Habitacion, b: Habitacion) => Number(a.limpieza) - Number(b.limpieza)
        );

        this.cd.detectChanges();
      },

      error: (err) => {

        console.error(err);

        this.error =
          'No se pudieron cargar las habitaciones. Verifique la conexión al servidor.';

        this.showNotification(this.error, false, 4000);

        this.cd.detectChanges();
      },

      complete: () => {
        this.loading = false;
        this.cd.detectChanges();
      }

    });

  }

  marcarLimpia(id: number): void {
    this.habitacionservice.updateLimpieza(id).subscribe({
      next: (data) => {
        if (!data.success) {
          console.error('Error del servidor al actualizar:', data.detail);
          this.showNotification(
            `Error al marcar habitación: ${data.detail || 'Fallo desconocido.'}`,
            false,
            4000
          );
          return;
        }
        this.habitaciones = this.habitaciones
          .map(h => h.id_habitacion === id ? { ...h, limpieza: true } : h)
          .sort((a, b) => Number(a.limpieza) - Number(b.limpieza));
        this.cd.detectChanges();
        this.showNotification(
          `Habitación marcada como limpia con éxito.`,
          true,
          3000
        );
      },

      error: (err) => {
        console.error(err);
        this.showNotification(
          'Error de conexión. Inténtalo de nuevo más tarde.',
          false,
          4000
        );
      }
    });
  }
}
