import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarA } from '../../components/navbar-a/navbar-a';
import { Footer } from '../../components/footer/footer';
import { Reserva as ReservaService } from '../../services/reserva';
import { Reserva } from '../../interfaces/reserva';

@Component({
  selector: 'app-c-reservas-h',
  imports: [CommonModule, Navbar, NavbarA, Footer],
  templateUrl: './c-reservas-h.html',
  styleUrl: './c-reservas-h.css',
})
export class CReservasH implements OnInit {
  historial: Reserva[] = [];
  error = '';
  isLoading = true;
  isLoaded = false;

  constructor(private cd: ChangeDetectorRef, private reservaservice: ReservaService) { }

  ngOnInit(): void {
    this.cargarHistorial();
    this.cd.detectChanges();
  }

  cargarHistorial(): void {
    this.isLoading = true;
    this.error = '';

    this.reservaservice.getReservasTerminadas().subscribe({
      next: (data: any) => {
        this.historial = data.data || [];
        // Eliminado la sobreescritura de "this.error" ya que el HTML usa un valor fallback
        this.isLoaded = true;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.historial = [];
        // Si el backend lanza error (por ej. 404 Not Found), asumimos lista vacía
        // Solo mostramos error si fue un problema real de servidor.
        if (err.status && err.status >= 500) {
            this.error = 'Error del servidor al cargar historial.';
        } else {
            this.error = ''; // Así el HTML mostrará 'Sin historial disponible'
        }
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }
}
