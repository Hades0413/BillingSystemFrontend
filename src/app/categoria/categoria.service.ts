import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../shared/categoria.model';
import { AuthService } from '../auth/auth.service';

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

  getCategoriasPorUsuario(): Observable<Categoria[]> {
    const usuarioId = parseInt(localStorage.getItem('UsuarioId')!, 10);
    if (usuarioId) {
      const headers = this.getAuthHeaders();
      return this.http.get<Categoria[]>(
        `${this.categoriaApiUrl}/listar?usuarioId=${usuarioId}`,
        { headers }
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
    return this.http.delete(
      `${this.categoriaApiUrl}/eliminar/${categoriaId}`,
      { headers }
    );
  }
}
