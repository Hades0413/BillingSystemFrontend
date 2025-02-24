import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../shared/categoria.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private categoriaApiUrl = environment.categoriaApiUrl;

  constructor(private http: HttpClient) {}

  getCategoriasPorUsuario(): Observable<Categoria[]> {
    const usuarioId = parseInt(localStorage.getItem('UsuarioId')!, 10);
    if (usuarioId) {
      return this.http.get<Categoria[]>(
        `${this.categoriaApiUrl}/listar?usuarioId=${usuarioId}`
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
      return this.http.post(
        `${this.categoriaApiUrl}/registrar`,
        categoriaConUsuarioId
      );
    } else {
      throw new Error('Usuario no autenticado');
    }
  }

  // Método para editar una categoría
  editarCategoria(categoriaId: number, categoria: Categoria): Observable<any> {
    return this.http.put(`${this.categoriaApiUrl}/editar/${categoriaId}`, {
      CategoriaNombre: categoria.CategoriaNombre,
      CategoriaInformacionAdicional: categoria.CategoriaInformacionAdicional,
    });
  }

  // Método para eliminar una categoría
  eliminarCategoria(categoriaId: number): Observable<any> {
    return this.http.delete(`${this.categoriaApiUrl}/eliminar/${categoriaId}`);
  }
}
