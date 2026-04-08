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

  get_modulos_rol(): Observable<any> {
    return this.http.get(`${this.URL}/rol/`, { headers: this.getHeaders() });
  }
}
