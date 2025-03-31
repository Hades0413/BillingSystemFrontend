import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Cotizacion } from '../shared/cotizacion.model';
import { CotizacionProductos } from '../shared/cotizacion-producto.model';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  private cotizacionApiUrl = environment.cotizacionApiUrl;
  private cotizacionProductoApiUrl = environment.cotizacionproductoApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCotizacionesPorUsuario(usuarioId: number): Observable<Cotizacion[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<Cotizacion[]>(
        `${this.cotizacionApiUrl}/listar-por-usuario/${usuarioId}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 404 && error.error.message) {
            // Si el error es 404 y tiene el mensaje que buscamos
            return throwError(() => new Error(error.error.message));
          } else {
            console.error('Error al obtener cotizaciones por usuario:', error);
            return throwError(
              () => new Error('Hubo un problema al obtener las cotizaciones.')
            );
          }
        })
      );
  }

  getProductosPorCotizacion(
    cotizacionId: number
  ): Observable<CotizacionProductos[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CotizacionProductos[]>(
      `${this.cotizacionProductoApiUrl}/listar-por-cotizacion/${cotizacionId}`,
      { headers }
    );
  }

  crearCotizacion(
    cotizacion: Cotizacion,
    productos: CotizacionProductos[]
  ): Observable<string> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const cotizacionConProductos = {
      ...cotizacion,
      productos: productos,
    };
    return this.http
      .post(`${this.cotizacionApiUrl}/registrar`, cotizacionConProductos, {
        headers,
        responseType: 'text',
      })
      .pipe(
        tap((response) => {
          console.log('Respuesta del servidor:', response);
        }),
        catchError((error) => {
          console.error('Error al crear la cotización:', error);
          return throwError(
            () => new Error('Hubo un problema al registrar la cotización.')
          );
        })
      );
  }

  crearProductosCotizacion(
    cotizacionProducto: CotizacionProductos[]
  ): Observable<CotizacionProductos[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<CotizacionProductos[]>(
      this.cotizacionProductoApiUrl,
      cotizacionProducto,
      { headers }
    );
  }
}
