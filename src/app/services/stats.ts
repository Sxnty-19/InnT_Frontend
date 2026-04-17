import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class Stats {
  private URL = `${API_CONFIG.baseUrl}/stats`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  // Indicadores

  getTotalUsuarios(): Observable<any> {
    return this.http.get(`${this.URL}/total-usuarios`, {
      headers: this.getHeaders(),
    });
  }

  getReservasProgramadas(): Observable<any> {
    return this.http.get(`${this.URL}/reservas-programadas`, {
      headers: this.getHeaders(),
    });
  }

  getHabitacionesDisponibles(): Observable<any> {
    return this.http.get(`${this.URL}/habitaciones-disponibles`, {
      headers: this.getHeaders(),
    });
  }

  getIngresosMes(): Observable<any> {
    return this.http.get(`${this.URL}/ingresos-mes`, {
      headers: this.getHeaders(),
    });
  }

  // Graficas

  getReservasMes(): Observable<any> {
    return this.http.get(`${this.URL}/reservas-mes`, {
      headers: this.getHeaders(),
    });
  }

  getIngresosMesChart(): Observable<any> {
    return this.http.get(`${this.URL}/ingresos-mes-chart`, {
      headers: this.getHeaders(),
    });
  }

  getTiposHabitacion(): Observable<any> {
    return this.http.get(`${this.URL}/tipos-habitacion`, {
      headers: this.getHeaders(),
    });
  }

  getUsuariosPorRol(): Observable<any> {
    return this.http.get(`${this.URL}/usuarios-rol`, {
      headers: this.getHeaders(),
    });
  }

  getHabitacionesPorTipo(): Observable<any> {
    return this.http.get(`${this.URL}/habitaciones-tipo`, {
      headers: this.getHeaders(),
    });
  }

  getSolicitudesPorDia(): Observable<any> {
    return this.http.get(`${this.URL}/solicitudes-dia`, {
      headers: this.getHeaders(),
    });
  }
}
