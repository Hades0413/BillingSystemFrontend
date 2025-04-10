/**
 * @file Servicio de autenticación que gestiona la autenticación de usuarios,
 * el registro, el inicio de sesión y la obtención de información relacionada con los usuarios.
 * Utiliza HttpClient para interactuar con las APIs RESTful y manejar las operaciones de autenticación.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../shared/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // URLs para las APIs de registro y autenticación, obtenidas de la configuración del entorno
  private registerApiUrl = environment.userApiUrl;
  private authApiUrl = environment.authApiUrl;

  /**
   * Constructor del servicio que inyecta el `HttpClient`.
   *
   * @param http - Instancia de `HttpClient` para hacer solicitudes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Registra a un nuevo usuario enviando la información a la API.
   * Verifica la presencia de un token de autenticación antes de hacer la solicitud.
   *
   * @param user - Objeto `User` que contiene la información del usuario a registrar.
   * @returns Un observable que emite el resultado del registro o un error en caso de fallo.
   */
  registerUser(user: User): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post(`${this.registerApiUrl}/registrar`, user, { headers })
      .pipe(
        catchError((error) => {
          return throwError(
            'Error al registrar el usuario. Intenta nuevamente.'
          );
        })
      );
  }

  /**
   * Inicia sesión con el correo y la contraseña del usuario.
   * Si el inicio de sesión es exitoso, guarda el token y la información del usuario en `localStorage`.
   * También obtiene el `usuarioId` del usuario después del inicio de sesión y lo guarda.
   *
   * @param usuarioCorreo - Correo electrónico del usuario.
   * @param usuarioContrasena - Contraseña del usuario.
   * @returns Un observable que emite el resultado del inicio de sesión o un error en caso de fallo.
   */
  login(usuarioCorreo: string, usuarioContrasena: string): Observable<any> {
    const loginData = {
      Correo: usuarioCorreo,
      Contrasena: usuarioContrasena,
    };

    return this.http.post(`${this.authApiUrl}/login`, loginData).pipe(
      tap((response: any) => {
        // Si la respuesta contiene un token, lo guarda en localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userEmail', usuarioCorreo);

          // Obtiene el usuarioId basándose en el correo del usuario
          this.getUsuarioId(usuarioCorreo).subscribe(
            (usuarioResponse: any) => {
              if (
                usuarioResponse &&
                usuarioResponse.data &&
                usuarioResponse.data.usuarioId
              ) {
                const usuarioId = usuarioResponse.data.usuarioId;
                localStorage.setItem('UsuarioId', usuarioId.toString());
              }
            },
            (error) => {
              // Manejo de error sin mostrarlo en consola
              return throwError('No se pudo obtener el usuarioId.');
            }
          );
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          // Error 401: credenciales inválidas
          return throwError('Credenciales inválidas. No autorizado.');
        }
        // Error genérico de inicio de sesión
        return throwError('Error de inicio de sesión. Intenta nuevamente.');
      })
    );
  }

  /**
   * Inicia sesión utilizando GitHub como proveedor de autenticación.
   * Redirige al usuario a la URL de autenticación de OAuth2 de GitHub.
   */
  loginWithGitHub(): void {
    window.location.href = `${this.authApiUrl}/oauth2-login`;
  }

  /**
   * Obtiene una lista de usuarios autenticados.
   * Utiliza el token almacenado en `localStorage` para autenticar la solicitud.
   *
   * @returns Un observable que emite la lista de usuarios o un error en caso de fallo.
   */
  listarUsuarios(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<any>(`${this.registerApiUrl}/listar`, { headers })
      .pipe(
        catchError((error) => {
          return throwError('Error al listar los usuarios.');
        })
      );
  }

  /**
   * Obtiene el `usuarioId` del usuario basándose en su correo electrónico.
   * Utiliza el token almacenado en `localStorage` para autenticar la solicitud.
   *
   * @param correo - Correo electrónico del usuario.
   * @returns Un observable que emite el `usuarioId` o un error en caso de fallo.
   */
  getUsuarioId(correo: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get(`${this.registerApiUrl}/correo/${correo}`, { headers })
      .pipe(
        catchError((error) => {
          return throwError('Error al obtener el usuarioId.');
        })
      );
  }

  /**
   * Verifica si el usuario está autenticado.
   * Esto se determina comprobando si el token está presente en `localStorage`.
   *
   * @returns `true` si el usuario está autenticado, `false` en caso contrario.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Obtiene el token de autenticación desde `localStorage`.
   *
   * @returns El token de autenticación o `null` si no está presente.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Cierra la sesión del usuario eliminando el token y el `usuarioId` de `localStorage`.
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('UsuarioId');
  }
}
