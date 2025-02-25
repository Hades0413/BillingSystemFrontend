import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../shared/venta.model';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

interface VentaResponse {
  data: Venta[];
}

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private ventaApiUrl = environment.ventaApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getVentasPorUsuario(usuarioId: number): Observable<VentaResponse> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<VentaResponse>(
      `${this.ventaApiUrl}/listar-por-usuario/${usuarioId}`,
      { headers }
    );
  }
}
