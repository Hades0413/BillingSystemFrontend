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
}
