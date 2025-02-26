import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../shared/producto.model';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

interface ProductoResponse {
  data: Producto[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private productoApiUrl = environment.productoApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProductosPorUsuario(usuarioId: number): Observable<ProductoResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ProductoResponse>(
      `${this.productoApiUrl}/listar/${usuarioId}`,
      { headers }
    );
  }

  editarProducto(productoId: number, producto: Producto): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(
      `${this.productoApiUrl}/editar/${productoId}`,
      producto,
      { headers }
    );
  }

  eliminarProducto(productoId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.productoApiUrl}/eliminar/${productoId}`, {
      headers,
    });
  }
}
