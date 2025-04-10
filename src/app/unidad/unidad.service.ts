import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Unidad } from '../shared/unidad.model';
import { AuthService } from '../auth/auth.service';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con las unidades.
 *
 * Este servicio interactúa con la API para obtener las unidades disponibles.
 */
@Injectable({
  providedIn: 'root',
})
export class UnidadService {
  // URL base de la API de unidades
  private unidadApiUrl = environment.unidadApiUrl;

  /**
   * Constructor del servicio `UnidadService`.
   *
   * @param http Instancia de `HttpClient` para realizar solicitudes HTTP.
   * @param authService Instancia del servicio `AuthService` para obtener el token de autenticación.
   */
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Obtiene los encabezados de autorización necesarios para realizar solicitudes autenticadas.
   *
   * El método obtiene el token de autenticación desde el servicio `AuthService` y lo agrega al encabezado
   * de la solicitud.
   *
   * @returns Un objeto `HttpHeaders` que contiene el encabezado de autorización con el token de autenticación.
   *
   * @throws Error Si no se encuentra el token de autenticación en el `localStorage`.
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  /**
   * Obtiene la lista de unidades registradas en la base de datos.
   *
   * Este método realiza una solicitud GET a la API para obtener todas las unidades.
   *
   * @returns Un observable que emite la lista de unidades.
   */
  getUnidades(): Observable<Unidad[]> {
    const headers = this.getAuthHeaders();
    // Realizar la solicitud GET para obtener todas las unidades
    return this.http.get<Unidad[]>(`${this.unidadApiUrl}/listar`, { headers });
  }
}
