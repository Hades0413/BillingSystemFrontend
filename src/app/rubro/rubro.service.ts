import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rubro } from '../shared/rubro.model';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RubroService {
  private rubroApiUrl = environment.rubroApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getRubros(): Observable<Rubro[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Rubro[]>(`${this.rubroApiUrl}/listar`, { headers });
  }
}
