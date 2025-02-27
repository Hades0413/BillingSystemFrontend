import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.registerApiUrl}/registrar`, user, {
      headers,
    });
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

          this.getUsuarioId(usuarioCorreo).subscribe((usuarioResponse: any) => {
            if (
              usuarioResponse &&
              usuarioResponse.data &&
              usuarioResponse.data.usuarioId
            ) {
              const usuarioId = usuarioResponse.data.usuarioId;
              localStorage.setItem('UsuarioId', usuarioId.toString());
            } else {
              console.error(
                'No se pudo obtener el usuarioId. Respuesta del servidor:',
                usuarioResponse
              );
            }
          });
        }
      })
    );
  }

  listarUsuarios(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.registerApiUrl}/listar`, { headers });
  }

  getUsuarioId(correo: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.registerApiUrl}/correo/${correo}`, {
      headers,
    });
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
