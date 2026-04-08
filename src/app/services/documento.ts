import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class Documento {
  private URL = `${API_CONFIG.baseUrl}/documentos`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` });
  }

  create_documento(data: any): Observable<any> {
    return this.http.post(`${this.URL}/`, data, { headers: this.getHeaders(), });
  }

  get_documentos_usuario(): Observable<any> {
    return this.http.get(`${this.URL}/usuario/`, { headers: this.getHeaders(), });
  }

  delete_documento(id_documento: number): Observable<any> {
    return this.http.delete(`${this.URL}/${id_documento}`, { headers: this.getHeaders(), });
  }
}
