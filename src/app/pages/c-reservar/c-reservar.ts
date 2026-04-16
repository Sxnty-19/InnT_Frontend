import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, NavbarA, Footer],
  templateUrl: './c-reservar.html',
  styleUrl: './c-reservar.css',
})
export class CReservar implements OnInit {
  activeTab: 'crear' | 'activas' = 'crear';
  
  // Filtros y Selección
  date_start = '';
  date_end = '';
  tiene_ninos: boolean | null = null;
  tiene_mascotas: boolean | null = null;
  
  availRooms: HabitacionDisponible[] = [];
  selectedRooms: HabitacionDisponible[] = [];
  reservasActivas: Reserva[] = [];

  // Estado de UI
  isLoading = false;
  message = '';
  isSuccess = false;
  showMessage = false;
  private notifTimeout: any;

  // Modal Cancelación
  isConfirmingCancel = false;
  reservationToCancel: Reserva | null = null;

  // --- CÁLCULOS EN TIEMPO REAL ---
  get totalCapacidad(): number {
    return this.selectedRooms.reduce((acc, hab) => acc + hab.capacidad_max, 0);
  }

  get totalDias(): number {
    if (!this.date_start || !this.date_end) return 0;
    const inicio = new Date(this.date_start);
    const fin = new Date(this.date_end);
    const diff = fin.getTime() - inicio.getTime();
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  }

  get totalCosto(): number {
    const dias = this.totalDias;
    return this.selectedRooms.reduce((acc, hab) => acc + (hab.precio_x_dia * dias), 0);
  }

  constructor(
    private cd: ChangeDetectorRef, 
    private reservaservice: ReservaService, 
    private habitacionservice: HabitacionService
  ) { }

  ngOnInit(): void {
    this.cargarReservas();
  }

  // --- GESTIÓN DE NOTIFICACIONES (Igual que en Perfil) ---
  hideNotification(): void {
    this.showMessage = false;
    this.message = '';
    if (this.notifTimeout) {
      clearTimeout(this.notifTimeout);
      this.notifTimeout = null;
    }
    this.cd.detectChanges();
  }

  showNotification(msg: string, success: boolean): void {
    // Si ya hay una notificación, la limpiamos primero
    if (this.notifTimeout) {
      clearTimeout(this.notifTimeout);
    }

    this.message = msg;
    this.isSuccess = success;
    this.showMessage = true;
    this.cd.detectChanges();

    // Se oculta automáticamente tras 4 segundos
    this.notifTimeout = setTimeout(() => {
      this.hideNotification();
    }, 4000);
  }

  // --- LÓGICA DE NEGOCIO ---
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
    if (!this.date_start || !this.date_end) {
      this.showNotification('Seleccione fecha inicio y fecha fin.', false);
      return;
    }

    if (new Date(this.date_end) <= new Date(this.date_start)) {
      this.showNotification('La fecha fin debe ser mayor que la fecha inicio.', false);
      return;
    }

    if (this.tiene_ninos === null || this.tiene_mascotas === null) {
      this.showNotification('Debes indicar si viajas con niños o mascotas.', false);
      return;
    }

    this.isLoading = true;
    this.availRooms = [];
    this.cd.detectChanges();

    this.habitacionservice.getDisponibles(this.date_start, this.date_end).subscribe({
      next: (data: any) => {
        this.availRooms = data.data || [];
        if (this.availRooms.length === 0) {
          this.showNotification('No hay habitaciones disponibles.', false);
        } else {
          this.showNotification(`Se encontraron ${this.availRooms.length} habitaciones.`, true);
        }
      },
      error: () => this.showNotification('Error al conectar con el servidor.', false),
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
    const hab = this.availRooms.find(r => r.id_habitacion === id);
    if (hab && !this.isSelected(id)) {
      this.selectedRooms = [...this.selectedRooms, hab];
      this.showNotification(`Habitación ${hab.numero} seleccionada.`, true);
    }
  }

  quitarHab(id: number): void {
    const room = this.selectedRooms.find(x => x.id_habitacion === id);
    this.selectedRooms = this.selectedRooms.filter(x => x.id_habitacion !== id);
    if (room) this.showNotification(`Habitación ${room.numero} quitada.`, false);
  }

  confirmarReserva(): void {
    if (this.selectedRooms.length === 0) {
      this.showNotification('Selecciona al menos una habitación.', false);
      return;
    }

    this.isLoading = true;
    this.cd.detectChanges();

    const payload = {
      date_start: this.date_start,
      date_end: this.date_end,
      tiene_ninos: this.tiene_ninos ? 1 : 0,
      tiene_mascotas: this.tiene_mascotas ? 1 : 0,
      habitaciones: this.selectedRooms.map(s => Number(s.id_habitacion)),
    };

    this.reservaservice.createReservaHabitaciones(payload).subscribe({
      next: () => {
        this.showNotification('¡Reserva creada exitosamente!', true);
        this.resetFormulario();
        this.cargarReservas();
        this.activeTab = 'activas';
      },
      error: (err) => this.showNotification(err.error?.detail || 'Error al crear la reserva.', false),
      complete: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  // --- CANCELACIÓN ---
  showCancelConfirmation(id: number): void {
    const reserva = this.reservasActivas.find(r => r.id_reserva === id);
    if (!reserva) return;

    const diffTime = new Date(reserva.date_start).getTime() - new Date().getTime();
    if (diffTime < (24 * 60 * 60 * 1000)) {
      this.showNotification('Debe cancelar con 24h de anticipación.', false);
      return;
    }

    this.reservationToCancel = reserva;
    this.isConfirmingCancel = true;
    this.cd.detectChanges();
  }

  executeCancellation(): void {
    if (!this.reservationToCancel) return;
    this.isLoading = true;
    const id = this.reservationToCancel.id_reserva;

    this.reservaservice.deleteReserva(id).subscribe({
      next: () => {
        this.showNotification('Reserva cancelada correctamente.', true);
        this.cargarReservas();
        this.cancelConfirmation();
      },
      error: () => this.showNotification('Error al cancelar la reserva.', false),
      complete: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  cancelConfirmation(): void {
    this.isConfirmingCancel = false;
    this.reservationToCancel = null;
    this.cd.detectChanges();
  }

  private resetFormulario(): void {
    this.selectedRooms = [];
    this.availRooms = [];
    this.date_start = '';
    this.date_end = '';
    this.tiene_ninos = null;
    this.tiene_mascotas = null;
    this.cd.detectChanges();
  }
}