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
import { Reserva } from '../../interfaces/reserva';
import { HabitacionDisponible } from '../../interfaces/habitacion';

@Component({
  selector: 'app-c-reservar',
  imports: [CommonModule, FormsModule, Navbar, NavbarA, Footer],
  templateUrl: './c-reservar.html',
  styleUrl: './c-reservar.css',
})
export class CReservar implements OnInit {
  activeTab: 'crear' | 'activas' = 'crear';
  date_start = '';
  date_end = '';
  availRooms: HabitacionDisponible[] = [];
  selectedRooms: HabitacionDisponible[] = [];
  reservasActivas: Reserva[] = [];
  isLoading = false;
  message = '';
  isSuccess = false;
  showMessage = false;
  tiene_ninos: boolean | null = null;
  tiene_mascotas: boolean | null = null;

  private notifTimeout: any;

  isConfirmingCancel = false;
  reservationToCancel: Reserva | null = null;

  get totalCapacidad(): number {
    return this.selectedRooms.reduce((acc, hab) => acc + hab.capacidad_max, 0);
  }

  get totalDias(): number {
    if (!this.date_start || !this.date_end) return 0;

    const inicio = new Date(this.date_start);
    const fin = new Date(this.date_end);

    const diff = fin.getTime() - inicio.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  get totalCosto(): number {
    const dias = this.totalDias;

    return this.selectedRooms.reduce((acc, hab) => {
      return acc + (hab.precio_x_dia * dias);
    }, 0);
  }

  constructor(private cd: ChangeDetectorRef, private reservaservice: ReservaService, private habitacionservice: HabitacionService) { }

  ngOnInit(): void {
    this.cargarReservas();
  }

  hideNotification(): void {
    this.showMessage = false;
    this.message = '';
    if (this.notifTimeout) clearTimeout(this.notifTimeout);
  }

  showNotification(msg: string, success: boolean): void {
    this.hideNotification();
    this.isSuccess = success;
    this.message = msg;
    this.showMessage = true;
    this.cd.detectChanges();
    this.notifTimeout = setTimeout(() => this.hideNotification(), 4000);
  }

  cargarReservas(): void {
    this.reservaservice.getReservasActivas().subscribe({

      next: (data: any) => {
        this.reservasActivas = data.data || [];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.reservasActivas = [];
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

    if (this.tiene_ninos === null || this.tiene_mascotas === null) {
      this.showNotification('Debes indicar si viajas con niños o mascotas.', false);
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

  isSelected(id: number): boolean {
    return this.selectedRooms.some(s => s.id_habitacion === id);
  }

  agregarHab(id: number): void {
    this.hideNotification();
    const hab = this.availRooms.find(r => r.id_habitacion === id);

    if (!hab) {
      this.showNotification('Habitación no encontrada.', false);
      return;
    }

    if (this.isSelected(id)) {
      this.showNotification('La habitación ya fue seleccionada.', false);
      return;
    }

    this.selectedRooms = [...this.selectedRooms, hab];

    this.showNotification(
      `Habitación ${hab.numero} agregada a la selección.`,
      true
    );
  }

  quitarHab(id: number): void {
    const roomName = this.selectedRooms.find(x => x.id_habitacion === id)?.numero || 'Habitación';
    this.selectedRooms = this.selectedRooms.filter(x => x.id_habitacion !== id);
    this.showNotification(`${roomName} quitada de la selección.`, false);
  }

  confirmarReserva(): void {

    this.hideNotification();
    this.isLoading = true;

    if (!this.date_start || !this.date_end) {
      this.showNotification('Las fechas son obligatorias.', false);
      this.isLoading = false;
      return;
    }

    if (this.selectedRooms.length === 0) {
      this.showNotification(
        'Debe seleccionar al menos una habitación.',
        false
      );
      this.isLoading = false;
      return;
    }

    const payload = {
      date_start: this.date_start,
      date_end: this.date_end,
      tiene_ninos: this.tiene_ninos,
      tiene_mascotas: this.tiene_mascotas,
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

    const reserva = this.reservasActivas.find(r => r.id_reserva === id);

    if (!reserva) {
      this.showNotification(
        'Reserva no encontrada o ya ha sido cancelada.',
        false
      );
      return;
    }

    const diffTime =
      new Date(reserva.date_start).getTime() -
      new Date().getTime();

    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (diffTime < twentyFourHours) {
      this.showNotification(
        'Debe cancelar con al menos 24 horas de anticipación.',
        false
      );
      return;
    }
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
        this.showNotification(
          'Reserva cancelada exitosamente.',
          true
        );
        this.cargarReservas();
      },

      error: () => {
        this.showNotification(
          'Error de conexión al intentar cancelar la reserva.',
          false
        );
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

    this.showNotification(
      'Cancelación detenida.',
      false
    );
  }
}
