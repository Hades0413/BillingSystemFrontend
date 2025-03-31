import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Importa catchError
import { Venta } from '../shared/venta.model';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { VentaProducto } from '../shared/venta-producto.model';

interface VentaResponse {
  data: Venta[];
}

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private ventaApiUrl = environment.ventaApiUrl;
  private ventaproductoApiUrl = environment.ventaproductoApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getVentasPorUsuario(usuarioId: number): Observable<VentaResponse> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<VentaResponse>(
        `${this.ventaApiUrl}/listar-por-usuario/${usuarioId}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 404 && error.error.message) {
            return throwError(() => new Error(error.error.message));
          } else {
            console.error('Error al obtener ventas por usuario:', error);
            return throwError(
              () => new Error('Hubo un problema al obtener las ventas.')
            );
          }
        })
      );
  }

  crearVenta(venta: Venta, DetallesVenta: VentaProducto[]): Observable<string> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const ventaConProductos = {
      ...venta,
      DetallesVenta: DetallesVenta,
    };

    return this.http
      .post(`${this.ventaApiUrl}/registrar`, ventaConProductos, {
        headers,
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          console.error('Error al crear la venta:', error);
          return throwError(
            () => new Error('Hubo un problema al registrar la venta.')
          );
        })
      );
  }

  crearProductosVenta(
    ventaProducto: VentaProducto[]
  ): Observable<VentaProducto[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post<VentaProducto[]>(this.ventaproductoApiUrl, ventaProducto, {
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error al crear productos de venta:', error);
          return throwError(
            () =>
              new Error(
                'Hubo un problema al registrar los productos de la venta.'
              )
          );
        })
      );
  }
}
