import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../shared/categoria.model';
import { AuthService } from '../auth/auth.service';

/**
 * Interface que define la estructura de la respuesta de la API para la gestión de categorías.
 *
 * La propiedad `data` contiene un arreglo de objetos `Categoria`, mientras que `code` y `message` proporcionan
 * información adicional sobre el estado de la respuesta de la API.
 */
export interface CategoriaResponse {
  code: number;
  message: string;
  data: Categoria[]; // Contiene las categorías obtenidas de la API
}

/**
 * Servicio para interactuar con la API de categorías.
 *
 * Este servicio proporciona métodos para obtener, registrar, editar y eliminar categorías,
 * utilizando autenticación basada en tokens (JWT) para realizar solicitudes HTTP seguras.
 */
@Injectable({
  providedIn: 'root', // El servicio está disponible a nivel de toda la aplicación.
})
export class CategoriaService {
  // URL base de la API de categorías extraída de las variables de entorno.
  private categoriaApiUrl = environment.categoriaApiUrl;

  /**
   * Constructor del servicio de categoría.
   *
   * @param http Cliente HTTP de Angular para hacer solicitudes a la API.
   * @param authService Servicio de autenticación para obtener el token de autenticación.
   */
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Método privado para obtener los encabezados de autenticación para las solicitudes HTTP.
   *
   * Utiliza el servicio `AuthService` para obtener el token de autenticación y agregarlo al encabezado.
   * Si no se encuentra el token, se lanza un error.
   *
   * @returns Un objeto `HttpHeaders` con el token de autorización.
   * @throws Error Si no se encuentra el token de autenticación.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Obtiene las categorías de un usuario específico.
   *
   * Realiza una solicitud GET a la API para obtener las categorías asociadas al usuario. El `usuarioId` se obtiene
   * desde el almacenamiento local y se incluye en la URL de la solicitud.
   *
   * @returns Un observable con la respuesta de la API, que contiene las categorías del usuario.
   * @throws Error Si el usuario no está autenticado o si hay un problema al obtener las categorías.
   */
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
            // Manejo de errores de la API, con mensajes personalizados.
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

  /**
   * Registra una nueva categoría para un usuario específico.
   *
   * Realiza una solicitud POST a la API para registrar una nueva categoría. Se toma el `UsuarioId` desde el almacenamiento
   * local y se incluye junto con los datos de la categoría en la solicitud.
   *
   * @param categoria El objeto `Categoria` que se desea registrar.
   * @returns Un observable que indica el éxito o el fracaso de la solicitud.
   * @throws Error Si el usuario no está autenticado.
   */
  registerCategoriasPorUsuario(categoria: Categoria): Observable<any> {
    const usuarioId = localStorage.getItem('UsuarioId');
    if (usuarioId) {
      // Se agrega el UsuarioId al objeto categoría antes de enviarlo a la API.
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

  /**
   * Edita los detalles de una categoría existente.
   *
   * Realiza una solicitud PUT a la API para actualizar los detalles de una categoría específica. Los datos del formulario
   * se envían en el cuerpo de la solicitud.
   *
   * @param categoriaId El ID de la categoría que se desea editar.
   * @param categoria El objeto `Categoria` que contiene los datos actualizados.
   * @returns Un observable que indica el éxito o el fracaso de la solicitud.
   */
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

  /**
   * Elimina una categoría específica.
   *
   * Realiza una solicitud DELETE a la API para eliminar una categoría utilizando su ID.
   *
   * @param categoriaId El ID de la categoría que se desea eliminar.
   * @returns Un observable que indica el éxito o el fracaso de la solicitud.
   */
  eliminarCategoria(categoriaId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.categoriaApiUrl}/eliminar/${categoriaId}`, {
      headers,
    });
  }
}
