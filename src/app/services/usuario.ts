import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class Usuario {
  private URL = `${API_CONFIG.baseUrl}/usuarios`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  get_usuario_id(): Observable<any> {
    return this.http.get(`${this.URL}/id/`, { headers: this.getHeaders() });
  }

  update_usuario(data: any): Observable<any> {
    return this.http.patch(`${this.URL}/`, data, { headers: this.getHeaders() });
  }
}
