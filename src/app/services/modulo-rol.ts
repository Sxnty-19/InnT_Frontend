import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ModuloRol {
  private URL = `${API_CONFIG.baseUrl}/modulos-roles`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  createModuloRol(data: any): Observable<any> {
    return this.http.post(this.URL + '/', data, { headers: this.getHeaders() });
  }

  getModulosRol(): Observable<any> {
    return this.http.get(this.URL + '/', { headers: this.getHeaders() });
  }

  getModuloRolById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/${id}`, { headers: this.getHeaders() });
  }

  get_modulos_rol(): Observable<any> { //
    return this.http.get(`${this.URL}/rol/`, { headers: this.getHeaders() });
  }

  get_modulos_roles(id: number): Observable<any> { //
    return this.http.get(`${this.URL}/roles/${id}`, { headers: this.getHeaders() });
  }
}
