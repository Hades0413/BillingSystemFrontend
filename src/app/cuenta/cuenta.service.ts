import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../shared/user.model';

@Injectable({
  providedIn: 'root',
})
export class CuentaService {
  private userApiUrl = environment.userApiUrl;

  constructor(private http: HttpClient) {}

  getUsuarioDetails(usuarioId: number): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<any>(`${this.userApiUrl}/editar/${usuarioId}`, { headers })
      .pipe(map((response) => response.data)); 
  }

  updateUser(usuarioId: number, user: User): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.userApiUrl}/editar/${usuarioId}`, user, { headers });
  }

  getUsuarioId(usuarioId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.userApiUrl}/listar/${usuarioId}`, { headers });
  }
}
