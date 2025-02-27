import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { TipoComprobante } from '../shared/tipo-comprobante.model';

@Injectable({
  providedIn: 'root',
})
export class TipoComprobanteService {
  private tipocomprobanteApiUrl = environment.tipocomprobanteApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTipoComprobantes(): Observable<TipoComprobante[]> {
    const headers = this.getAuthHeaders();

    return this.http.get<TipoComprobante[]>(`${this.tipocomprobanteApiUrl}/listar`, { headers }).pipe(
      catchError((error) => {
        return throwError('Error al obtener los tipos de comprobantes');
      })
    );
  }
}
