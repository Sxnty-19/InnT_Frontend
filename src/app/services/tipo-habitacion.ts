import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class TipoHabitacion {
  private URL = `${API_CONFIG.baseUrl}/tipos-habitacion`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  create_tipoHabitacion(data: any): Observable<any> {
    return this.http.post(`${this.URL}/`, data, { headers: this.getHeaders(), });
  }

  get_tiposHabitacion(): Observable<any> {
    return this.http.get(`${this.URL}/`, { headers: this.getHeaders(), });
  }
}
