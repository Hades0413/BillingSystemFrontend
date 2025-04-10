import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Cliente } from '../shared/cliente.model';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con los clientes.
 *
 * Este servicio se utiliza para realizar peticiones HTTP al backend relacionadas
 * con los clientes, como la obtención de la lista de clientes o la búsqueda de clientes
 * por nombre. Además, se asegura de incluir el token de autenticación en cada petición
 * para asegurar que el usuario tenga permisos para acceder a los datos.
 */
@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  // URL de la API que maneja los clientes, obtenida del archivo de configuración del entorno.
  private clienteApiUrl = environment.clienteApiUrl;

  /**
   * Constructor del servicio `ClienteService`.
   *
   * @param http Instancia de `HttpClient` para realizar solicitudes HTTP.
   * @param authService Instancia de `AuthService` para obtener el token de autenticación.
   */
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Obtiene la lista completa de clientes desde la API.
   *
   * Este método realiza una solicitud GET a la API para obtener todos los clientes,
   * incluyendo el token de autenticación en las cabeceras de la solicitud.
   *
   * @returns Un observable que emite un array de objetos `Cliente`.
   * @throws Error Si no se encuentra el token de autenticación.
   */
  getClientes(): Observable<Cliente[]> {
    // Obtener el token de autenticación del servicio AuthService
    const token = this.authService.getToken();

    // Verificar si se obtuvo el token
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    // Crear las cabeceras de la solicitud incluyendo el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud GET a la API y retornar el observable
    return this.http.get<Cliente[]>(`${this.clienteApiUrl}/listar`, {
      headers,
    });
  }

  /**
   * Obtiene la lista de clientes filtrada por su nombre legal.
   *
   * Este método realiza una solicitud GET a la API para obtener los clientes cuyo nombre
   * coincida con el parámetro `nombre` proporcionado. Al igual que en el método anterior,
   * se incluye el token de autenticación en las cabeceras de la solicitud.
   *
   * @param nombre El nombre legal de los clientes a buscar.
   * @returns Un observable que emite un array de objetos `Cliente`.
   * @throws Error Si no se encuentra el token de autenticación.
   */
  getClientesPorNombre(nombre: string): Observable<Cliente[]> {
    // Obtener el token de autenticación del servicio AuthService
    const token = this.authService.getToken();

    // Verificar si se obtuvo el token
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    // Crear las cabeceras de la solicitud incluyendo el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud GET a la API con el nombre proporcionado y retornar el observable
    return this.http.get<Cliente[]>(
      `${this.clienteApiUrl}/listar/nombre/${nombre}`,
      { headers }
    );
  }
}
