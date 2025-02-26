import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Unidad } from '../shared/unidad.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UnidadService {
  private unidadApiUrl = environment.unidadApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUnidades(): Observable<Unidad[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Unidad[]>(`${this.unidadApiUrl}/listar`, { headers });
  }
}
