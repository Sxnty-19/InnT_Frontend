import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class Rol {
  private URL = `${API_CONFIG.baseUrl}/roles`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  createRol(rol: any): Observable<any> {
    return this.http.post(this.URL + '/', rol, { headers: this.getHeaders() });
  }

  getRoles(): Observable<any> {
    return this.http.get(this.URL + '/', { headers: this.getHeaders() });
  }

  getRolById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/${id}`, { headers: this.getHeaders() });
  }

  getRolesActivos(): Observable<any> {
    return this.http.get(`${this.URL}/activos/`, { headers: this.getHeaders() });
  }

  updateEstado(id: number): Observable<any> {
    return this.http.put(`${this.URL}/${id}`, {}, { headers: this.getHeaders() });
  }
}
