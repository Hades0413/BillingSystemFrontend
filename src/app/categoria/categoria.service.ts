import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../shared/categoria.model';
import { AuthService } from '../auth/auth.service';
export interface CategoriaResponse {
  code: number;
  message: string;
  data: Categoria[]; // Aquí está la propiedad 'data' que contiene las categorías
}
@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private categoriaApiUrl = environment.categoriaApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCategoriasPorUsuario(): Observable<CategoriaResponse> {
    const usuarioId = parseInt(localStorage.getItem('UsuarioId')!, 10);
    if (usuarioId) {
      const headers = this.getAuthHeaders();
      return this.http
        .get<CategoriaResponse>(`${this.categoriaApiUrl}/listar/${usuarioId}`, {
          headers,
        })
        .pipe(
          catchError((error) => {
            if (error.status === 404 && error.error.message) {
              return throwError(() => new Error(error.error.message));
            } else {
              return throwError(
                () => new Error('Hubo un problema al obtener las categorías.')
              );
            }
          })
        );
    } else {
      throw new Error('Usuario no autenticado');
    }
  }

  registerCategoriasPorUsuario(categoria: Categoria): Observable<any> {
    const usuarioId = localStorage.getItem('UsuarioId');
    if (usuarioId) {
      const categoriaConUsuarioId = {
        ...categoria,
        UsuarioId: parseInt(usuarioId, 10),
      };
      const headers = this.getAuthHeaders();
      return this.http.post(
        `${this.categoriaApiUrl}/registrar`,
        categoriaConUsuarioId,
        { headers }
      );
    } else {
      throw new Error('Usuario no autenticado');
    }
  }

  editarCategoria(categoriaId: number, categoria: Categoria): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(
      `${this.categoriaApiUrl}/editar/${categoriaId}`,
      {
        CategoriaNombre: categoria.CategoriaNombre,
        CategoriaInformacionAdicional: categoria.CategoriaInformacionAdicional,
      },
      { headers }
    );
  }

  eliminarCategoria(categoriaId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.categoriaApiUrl}/eliminar/${categoriaId}`, {
      headers,
    });
  }
}
