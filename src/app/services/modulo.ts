import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class Modulo {
  private URL = `${API_CONFIG.baseUrl}/modulos`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  createModulo(modulo: any): Observable<any> {
    return this.http.post(this.URL + '/', modulo, { headers: this.getHeaders() });
  }

  getModulos(): Observable<any> {
    return this.http.get(this.URL + '/', { headers: this.getHeaders() });
  }

  getModuloById(id: number): Observable<any> {
    return this.http.get(`${this.URL}/${id}`, { headers: this.getHeaders() });
  }
}
