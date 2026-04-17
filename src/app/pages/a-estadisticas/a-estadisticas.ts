import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { NavbarA } from '../../components/navbar-a/navbar-a';
import { Footer } from '../../components/footer/footer';
import { Stats as StatsService } from '../../services/stats';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-a-estadisticas',
  imports: [CommonModule, Navbar, NavbarA, Footer],
  templateUrl: './a-estadisticas.html',
  styleUrl: './a-estadisticas.css',
})

export class AEstadisticas implements OnInit {
  totalUsuarios: number = 0;
  reservasProgramadas: number = 0;
  habitacionesDisponibles: number = 0;
  ingresosMes: number = 0;

  constructor(
    private statsService: StatsService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarKPIs();
    this.cargarReservasPorMes();
    this.cargarIngresosPorMes();
    this.cargarTiposHabitacion();
    this.cargarUsuariosPorRol();
    this.cargarHabitacionesPorTipo();
    this.cargarSolicitudesPorDia();

  }

  cargarKPIs() {
    this.statsService.getTotalUsuarios().subscribe(res => {
      this.totalUsuarios = res.data;
      this.cd.detectChanges();
    });

    this.statsService.getReservasProgramadas().subscribe(res => {
      this.reservasProgramadas = res.data;
      this.cd.detectChanges();
    });

    this.statsService.getHabitacionesDisponibles().subscribe(res => {
      this.habitacionesDisponibles = res.data;
      this.cd.detectChanges();
    });

    this.statsService.getIngresosMes().subscribe(res => {
      this.ingresosMes = res.data;
      this.cd.detectChanges();
    });
  }

  cargarReservasPorMes() {
    this.statsService.getReservasMes().subscribe(res => {
      const data = res.data;

      const labels = data.map((item: any) =>
        new Date(item.mes).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
      );

      const valores = data.map((item: any) => item.total);

      const ctx = document.getElementById('reservasChart') as HTMLCanvasElement;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Reservas',
              data: valores,
              borderWidth: 2,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    });
  }

  cargarIngresosPorMes() {
    this.statsService.getIngresosMesChart().subscribe(res => {
      const data = res.data;

      const labels = data.map((item: any) =>
        new Date(item.mes).toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })
      );

      const valores = data.map((item: any) => item.ingresos);

      const ctx = document.getElementById('ingresosChart') as HTMLCanvasElement;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Ingresos',
              data: valores
            }
          ]
        }
      });
    });
  }

  cargarTiposHabitacion() {
    this.statsService.getTiposHabitacion().subscribe(res => {
      const data = res.data;

      const labels = data.map((item: any) => item.nombre);
      const valores = data.map((item: any) => item.total);

      const ctx = document.getElementById('tiposChart') as HTMLCanvasElement;

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [
            {
              data: valores
            }
          ]
        }
      });
    });
  }

  cargarUsuariosPorRol() {
    this.statsService.getUsuariosPorRol().subscribe(res => {
      const data = res.data;

      const labels = data.map((item: any) => item.nombre);
      const valores = data.map((item: any) => item.total);

      const ctx = document.getElementById('rolesChart') as HTMLCanvasElement;

      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Usuarios',
                data: valores
              }
            ]
          },
          options: {
            responsive: true
          }
        });
      }
    });
  }

  cargarHabitacionesPorTipo() {
    this.statsService.getHabitacionesPorTipo().subscribe(res => {
      const data = res.data;

      const labels = data.map((item: any) => item.nombre);
      const valores = data.map((item: any) => item.total);

      const ctx = document.getElementById('habitacionesChart') as HTMLCanvasElement;

      if (ctx) {
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Habitaciones',
                data: valores
              }
            ]
          },
          options: {
            responsive: true
          }
        });
      }
    });
  }

  cargarSolicitudesPorDia() {
    this.statsService.getSolicitudesPorDia().subscribe(res => {
      const data = res.data;

      const labels = data.map((item: any) =>
        new Date(item.dia).toLocaleDateString('es-CO')
      );

      const valores = data.map((item: any) => item.total);

      const ctx = document.getElementById('solicitudesChart') as HTMLCanvasElement;

      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Solicitudes',
                data: valores,
                tension: 0.3
              }
            ]
          },
          options: {
            responsive: true
          }
        });
      }
    });
  }
}
