import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class Reserva {
  private URL = `${API_CONFIG.baseUrl}/reservas`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  createReserva(data: any): Observable<any> {
    return this.http.post(this.URL, data, { headers: this.getHeaders() });
  }

  getReservas(): Observable<any[]> {
    return this.http.get<any[]>(this.URL, { headers: this.getHeaders() });
  }

  getReservaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.URL}/${id}`, { headers: this.getHeaders() });
  }

  getReservasActivas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/activas/`, { headers: this.getHeaders() });
  }

  getReservasTerminadas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/terminadas/`, { headers: this.getHeaders() });
  }

  getReservasUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/usuarios/`, { headers: this.getHeaders() });
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.URL}/${id}`, { headers: this.getHeaders() });
  }

  createReservaHabitaciones(data: any): Observable<any> {
    return this.http.post(`${this.URL}/habitaciones/`, data, { headers: this.getHeaders() });
  }
}
