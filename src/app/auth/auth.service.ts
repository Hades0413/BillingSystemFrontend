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
  private registerApiUrl = environment.userApiUrl;
  private authApiUrl = environment.authApiUrl;

  constructor(private http: HttpClient) {}

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

  login(usuarioCorreo: string, usuarioContrasena: string): Observable<any> {
    const loginData = {
      Correo: usuarioCorreo,
      Contrasena: usuarioContrasena,
    };

    return this.http.post(`${this.authApiUrl}/login`, loginData).pipe(
      tap((response: any) => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userEmail', usuarioCorreo);

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
              // Manejo del error para obtener el usuarioId sin imprimirlo en consola
              return throwError('No se pudo obtener el usuarioId.');
            }
          );
        }
      }),
      catchError((error) => {
        if (error.status === 401) {
          // Si el status es 401, devolver un error específico para ese caso
          return throwError('Credenciales inválidas. No autorizado.');
        }
        // Para otros errores de la petición
        return throwError('Error de inicio de sesión. Intenta nuevamente.');
      })
    );
  }

  loginWithGitHub(): void {
    window.location.href = `${this.authApiUrl}/oauth2-login`;
  }

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

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('UsuarioId');
  }
}
