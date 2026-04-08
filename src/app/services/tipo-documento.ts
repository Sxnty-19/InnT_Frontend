import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class TipoDocumento {
  private URL = `${API_CONFIG.baseUrl}/tipos-documento`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  create_tipoDocumento(data: any): Observable<any> {
    return this.http.post(`${this.URL}/`, data, { headers: this.getHeaders() });
  }

  get_tiposDocumento(): Observable<any> {
    return this.http.get(`${this.URL}/`, { headers: this.getHeaders() });
  }
}
