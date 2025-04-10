import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../shared/user.model';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con las cuentas de usuario.
 *
 * Este servicio interactúa con la API para obtener detalles de los usuarios, actualizar información
 * de sus cuentas y obtener su identificador, todo ello utilizando un token de autenticación en las cabeceras.
 */
@Injectable({
  providedIn: 'root',
})
export class CuentaService {
  // URL base de la API de usuarios
  private userApiUrl = environment.userApiUrl;

  /**
   * Constructor del servicio `CuentaService`.
   *
   * @param http Instancia de `HttpClient` para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los detalles de un usuario específico.
   *
   * Este método realiza una solicitud GET para obtener los detalles del usuario,
   * utilizando el `usuarioId` y el token de autenticación en las cabeceras de la solicitud.
   *
   * @param usuarioId El identificador del usuario para el cual se obtienen los detalles.
   * @returns Un observable que emite los detalles del usuario (`User`).
   * @throws Error Si no se encuentra el token de autenticación.
   */
  getUsuarioDetails(usuarioId: number): Observable<User> {
    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('token');

    // Verificar si se obtuvo el token
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    // Crear las cabeceras de la solicitud incluyendo el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud GET para obtener los detalles del usuario
    return this.http
      .get<any>(`${this.userApiUrl}/editar/${usuarioId}`, { headers })
      .pipe(
        // Mapear la respuesta para obtener únicamente los datos del usuario
        map((response) => response.data)
      );
  }

  /**
   * Actualiza la información de un usuario específico.
   *
   * Este método realiza una solicitud PUT para actualizar los detalles del usuario,
   * utilizando el `usuarioId` y el token de autenticación en las cabeceras de la solicitud.
   *
   * @param usuarioId El identificador del usuario cuyo detalle se desea actualizar.
   * @param user El objeto `User` con los nuevos datos del usuario.
   * @returns Un observable que emite la respuesta de la API.
   * @throws Error Si no se encuentra el token de autenticación.
   */
  updateUser(usuarioId: number, user: User): Observable<any> {
    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('token');

    // Verificar si se obtuvo el token
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    // Crear las cabeceras de la solicitud incluyendo el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud PUT para actualizar los detalles del usuario
    return this.http.put<any>(`${this.userApiUrl}/editar/${usuarioId}`, user, {
      headers,
    });
  }

  /**
   * Obtiene la información de un usuario específico mediante su ID.
   *
   * Este método realiza una solicitud GET para obtener la información básica del usuario
   * identificado por el `usuarioId` y el token de autenticación en las cabeceras de la solicitud.
   *
   * @param usuarioId El identificador del usuario cuyo detalle se desea obtener.
   * @returns Un observable que emite la respuesta de la API con la información del usuario.
   * @throws Error Si no se encuentra el token de autenticación.
   */
  getUsuarioId(usuarioId: number): Observable<any> {
    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem('token');

    // Verificar si se obtuvo el token
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    // Crear las cabeceras de la solicitud incluyendo el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud GET para obtener la información del usuario
    return this.http.get(`${this.userApiUrl}/listar/${usuarioId}`, { headers });
  }
}
