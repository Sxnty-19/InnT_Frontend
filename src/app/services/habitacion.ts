import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class Habitacion {
  private URL = `${API_CONFIG.baseUrl}/habitaciones`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  createHabitacion(data: any): Observable<any> {
    return this.http.post(this.URL, data, { headers: this.getHeaders() });
  }

  getHabitaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.URL, { headers: this.getHeaders() });
  }

  getDisponibles(date_start: string, date_end: string): Observable<any[]> { //
    return this.http.get<any[]>(`${this.URL}/disponibles/`, { headers: this.getHeaders(), params: { date_start, date_end } });
  }

  updateLimpieza(id: number): Observable<any> {
    return this.http.put(`${this.URL}/${id}`, {}, { headers: this.getHeaders() });
  }
}
