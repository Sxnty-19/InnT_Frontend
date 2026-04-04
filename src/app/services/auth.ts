import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private URL = `${API_CONFIG.baseUrl}/auth`;

  constructor(private http: HttpClient) { }

  register(data: any): Observable<any> {
    return this.http.post(`${this.URL}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.URL}/login`, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  }
}
