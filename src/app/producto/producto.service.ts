import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; // Importamos catchError
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

  // Manejo de errores agregado a la llamada HTTP
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Error de red o problemas de conexión
      console.error('Un error ocurrió:', error.error);
      return throwError(() => new Error('Error de red. Verifique su conexión.'));
    } else {
      // Errores de HTTP (4xx, 5xx)
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
      return throwError(() => new Error(`Error HTTP: ${error.status}`));
    }
  }

  // Método para obtener los productos de un usuario
  getProductosPorUsuario(usuarioId: number): Observable<ProductoResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<ProductoResponse>(
      `${this.productoApiUrl}/listar/${usuarioId}`,
      { headers }
    ).pipe(
      catchError(this.handleError) // Aplicamos el manejo de errores
    );
  }

  // Método para editar un producto
  editarProducto(productoId: number, producto: Producto): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(
      `${this.productoApiUrl}/editar/${productoId}`,
      producto,
      { headers }
    ).pipe(
      catchError(this.handleError) // Aplicamos el manejo de errores
    );
  }

  // Método para eliminar un producto
  eliminarProducto(productoId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.productoApiUrl}/eliminar/${productoId}`, {
      headers,
    }).pipe(
      catchError(this.handleError) // Aplicamos el manejo de errores
    );
  }
}

