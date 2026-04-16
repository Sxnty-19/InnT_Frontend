import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarA } from '../../components/navbar-a/navbar-a';
import { Footer } from '../../components/footer/footer';
import { Reserva as ReservaService } from '../../services/reserva';
import { Habitacion as HabitacionService } from '../../services/habitacion';
import { ReservaUsuario } from '../../interfaces/reserva';
import { HabitacionDisponible } from '../../interfaces/habitacion';

@Component({
  selector: 'app-a-reservas',
  imports: [CommonModule, FormsModule, Navbar, NavbarA, Footer],
  templateUrl: './a-reservas.html',
  styleUrl: './a-reservas.css',
})
export class AReservas implements OnInit {

  constructor(private cd: ChangeDetectorRef, private habitacionservice: HabitacionService, private reservaservice: ReservaService) { }

  activeTab: 'crear' | 'listado' = 'crear';

  isLoading = false;
  isSubmitting = false;
  loadingListado = true;

  id_usuario = '';
  date_start = '';
  date_end = '';
  availRooms: HabitacionDisponible[] = [];
  selectedRooms: HabitacionDisponible[] = [];
  reservas: ReservaUsuario[] = [];

  message = '';
  isSuccess = false;
  showMessage = false;
  private toastTimeout: any;

  isConfirmingCancel = false;
  reservationToCancel: ReservaUsuario | null = null;

  ngOnInit(): void {
    this.cargarReservas();
  }

  hideNotification(): void {
    this.showMessage = false;
    this.message = '';
  }

  showNotification(msg: string, success: boolean): void {
    this.hideNotification();
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.isSuccess = success;
    this.message = msg;
    this.showMessage = true;
    this.toastTimeout = setTimeout(() => this.hideNotification(), 4000);
  }

  cargarReservas(): void {
    this.loadingListado = true;
    this.reservaservice.getReservasUsuarios().subscribe({
      next: (data: any) => {
        this.reservas = data.data || [];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.reservas = [];
        this.showNotification('Error de conexión al cargar el listado.', false);
        this.cd.detectChanges();
      },
      complete: () => {
        this.loadingListado = false;
        this.cd.detectChanges();
      }
    });

  }

  buscarHabitaciones(): void {

    this.hideNotification();
    this.availRooms = [];
    this.isLoading = true;

    if (!this.date_start || !this.date_end) {
      this.showNotification('Seleccione fecha inicio y fecha fin.', false);
      this.isLoading = false;
      return;
    }

    if (new Date(this.date_end) <= new Date(this.date_start)) {
      this.showNotification('La fecha fin debe ser mayor que la fecha inicio.', false);
      this.isLoading = false;
      return;
    }

    this.habitacionservice
      .getDisponibles(this.date_start, this.date_end)
      .subscribe({
        next: (data: any) => {
          this.availRooms = data.data || [];

          if (this.availRooms.length === 0) {
            this.showNotification(
              'No hay habitaciones disponibles en esas fechas.',
              false
            );
          } else {
            this.showNotification(
              `Se encontraron ${this.availRooms.length} habitaciones disponibles.`,
              true
            );
          }
        },

        error: () => {
          this.showNotification('No hay conexión con el servidor.', false);
        },

        complete: () => {
          this.isLoading = false;
          this.cd.detectChanges();
        }
      });
  }

  agregarHab(id: number): void {
    this.hideNotification();
    const hab = this.availRooms.find(r => r.id_habitacion === id);
    if (!hab) { this.showNotification('Habitación no encontrada.', false); return; }
    if (this.selectedRooms.some(s => s.id_habitacion === hab.id_habitacion)) {
      this.showNotification('La habitación ya fue seleccionada.', false); return;
    }
    this.selectedRooms = [...this.selectedRooms, hab];
    this.showNotification(`Habitación ${hab.numero} agregada.`, true);
    this.cd.detectChanges();
  }

  quitarHab(id: number): void {
    const roomName = this.selectedRooms.find(x => x.id_habitacion === id)?.numero || 'Habitación';
    this.selectedRooms = this.selectedRooms.filter(x => x.id_habitacion !== id);
    this.showNotification(`${roomName} quitada.`, false);
    this.cd.detectChanges();
  }

  isSelected(id: number): boolean {
    return this.selectedRooms.some(s => s.id_habitacion === id);
  }

  confirmarReserva(): void {

    this.hideNotification();
    this.isLoading = true;

    if (!this.date_start || !this.date_end) {
      this.showNotification('Las fechas son obligatorias.', false);
      this.isSubmitting = false;
      return;
    }

    if (this.selectedRooms.length === 0) {
      this.showNotification(
        'Debe seleccionar al menos una habitación.',
        false
      );
      this.isSubmitting = false;
      return;
    }

    const payload = {
      date_start: this.date_start,
      date_end: this.date_end,
      habitaciones: this.selectedRooms.map(s => Number(s.id_habitacion)),
    };

    this.reservaservice.createReservaHabitaciones(payload).subscribe({

      next: () => {
        this.showNotification(
          '¡Reserva creada exitosamente! Puedes verla en Reservas Activas.',
          true
        );

        this.selectedRooms = [];
        this.availRooms = [];
        this.date_start = '';
        this.date_end = '';

        this.cargarReservas();
      },

      error: () => {
        this.showNotification('Error al crear la reserva.', false);
      },

      complete: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  showCancelConfirmation(id: number): void {
    this.hideNotification();
    const reserva = this.reservas.find(r => r.id_reserva === id);
    if (!reserva) { this.showNotification('Reserva no encontrada.', false); return; }
    if (reserva.estado !== true) { this.showNotification('La reserva ya está cancelada.', false); return; }
    this.reservationToCancel = reserva;
    this.isConfirmingCancel = true;
  }

  executeCancellation(): void {
    if (!this.reservationToCancel) return;
    this.isLoading = true;
    const id = this.reservationToCancel.id_reserva;
    this.isConfirmingCancel = false;

    this.reservaservice.deleteReserva(id).subscribe({
      next: () => {

        this.showNotification('Reserva cancelada exitosamente.', true);

        this.cargarReservas();
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Error al cancelar la reserva.', false);
      },
      complete: () => {
        this.isLoading = false;
        this.reservationToCancel = null;
        this.cd.detectChanges();
      }
    });

  }

  cancelConfirmation(): void {
    this.isConfirmingCancel = false;
    this.reservationToCancel = null;
    this.showNotification('Cancelación detenida.', false);
  }

  getReservasActivas(): number {
    return this.reservas.filter(r => r.estado === true).length;
  }
}
