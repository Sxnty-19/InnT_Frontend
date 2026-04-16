import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class Solicitud {
  private URL = `${API_CONFIG.baseUrl}/solicitudes`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  create_solicitud(data: any): Observable<any> {
    return this.http.post(`${this.URL}/`, data, { headers: this.getHeaders() });
  }

  get_solicitudes(): Observable<any> {
    return this.http.get(`${this.URL}/`, { headers: this.getHeaders() });
  }

  get_solicitudes_usuario(): Observable<any> { //
    return this.http.get(`${this.URL}/usuario/`, { headers: this.getHeaders() });
  }

  create_solicitud_habitacion(data: any): Observable<any> { //
    const formData = new FormData();

    formData.append('id_usuario', data.id_usuario);
    formData.append('numero_habitacion', data.numero_habitacion);
    formData.append('descripcion', data.descripcion);
    formData.append('estado', data.estado);

    return this.http.post(`${this.URL}/habitacion/`, formData, {
      headers: this.getHeaders()
    });
  }

  update_solicitud(id_solicitud: number): Observable<any> {
    return this.http.put(`${this.URL}/${id_solicitud}`, {}, { headers: this.getHeaders() });
  }
}
