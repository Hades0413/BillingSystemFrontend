import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../shared/producto.model';
import { environment } from '../../environments/environment';

interface ProductoResponse {
  data: Producto[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private productoApiUrl = environment.productoApiUrl;

  constructor(private http: HttpClient) {}

  getProductosPorUsuario(usuarioId: number): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      `${this.productoApiUrl}/listar/${usuarioId}`
    );
  }

  // Método para editar un producto
  editarProducto(productoId: number, producto: Producto): Observable<any> {
    return this.http.put(
      `${this.productoApiUrl}/editar/${productoId}`,
      producto
    );
  }

  // Método para eliminar un producto
  eliminarProducto(productoId: number): Observable<any> {
    return this.http.delete(`${this.productoApiUrl}/eliminar/${productoId}`);
  }

}
