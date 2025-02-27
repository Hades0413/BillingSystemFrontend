import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // Método para obtener las cotizaciones por usuario
  getCotizacionesPorUsuario(usuarioId: number): Observable<Cotizacion[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Cotizacion[]>(
      `${this.cotizacionApiUrl}/listar-por-usuario/${usuarioId}`,
      { headers }
    );
  }

  // Método para obtener los productos asociados a una cotización
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

  // Método para crear una cotización y sus productos
  crearCotizacion(
    cotizacion: Cotizacion,
    productos: CotizacionProductos[]
  ): Observable<Cotizacion> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const cotizacionConProductos = {
      ...cotizacion,
      productos: productos,
    };

    // Cambia la URL para que apunte al endpoint correcto "/registrar"
    return this.http.post<Cotizacion>(
      `${this.cotizacionApiUrl}/registrar`,  // Se agrega "/registrar"
      cotizacionConProductos,
      { headers }
    );
  }

  // Método para crear productos asociados a una cotización
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
