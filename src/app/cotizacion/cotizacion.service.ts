import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Cotizacion } from '../shared/cotizacion.model';
import { CotizacionProductos } from '../shared/cotizacion-producto.model';

/**
 * Servicio encargado de gestionar las cotizaciones y productos asociados a las mismas.
 *
 * Este servicio permite interactuar con la API para realizar operaciones como la obtención
 * de cotizaciones de un usuario, la obtención de productos asociados a una cotización,
 * la creación de nuevas cotizaciones y la creación de productos asociados a una cotización.
 */
@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  // URLs de las APIs que manejan las cotizaciones y los productos de las cotizaciones
  private cotizacionApiUrl = environment.cotizacionApiUrl;
  private cotizacionProductoApiUrl = environment.cotizacionproductoApiUrl;

  /**
   * Constructor del servicio `CotizacionService`.
   *
   * @param http Instancia de `HttpClient` para realizar solicitudes HTTP.
   * @param authService Instancia de `AuthService` para obtener el token de autenticación.
   */
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Obtiene todas las cotizaciones de un usuario específico desde la API.
   *
   * Este método realiza una solicitud GET a la API para obtener las cotizaciones del
   * usuario identificado por el `usuarioId`. Incluye el token de autenticación en las cabeceras
   * de la solicitud para garantizar que el usuario esté autorizado para acceder a la información.
   *
   * @param usuarioId El identificador del usuario para el cual se obtienen las cotizaciones.
   * @returns Un observable que emite un array de objetos `Cotizacion`.
   * @throws Error Si no se encuentra el token de autenticación o si ocurre un error en la API.
   */
  getCotizacionesPorUsuario(usuarioId: number): Observable<Cotizacion[]> {
    // Obtener el token de autenticación del servicio AuthService
    const token = this.authService.getToken();

    // Verificar si se obtuvo el token
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    // Crear las cabeceras de la solicitud incluyendo el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud GET a la API y retornar el observable
    return this.http
      .get<Cotizacion[]>(
        `${this.cotizacionApiUrl}/listar-por-usuario/${usuarioId}`,
        { headers }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 404 && error.error.message) {
            // Si el error es 404 y tiene el mensaje que buscamos
            return throwError(() => new Error(error.error.message));
          } else {
            console.error('Error al obtener cotizaciones por usuario:', error);
            return throwError(
              () => new Error('Hubo un problema al obtener las cotizaciones.')
            );
          }
        })
      );
  }

  /**
   * Obtiene los productos asociados a una cotización específica.
   *
   * Este método realiza una solicitud GET a la API para obtener los productos
   * asociados a una cotización identificada por `cotizacionId`. También incluye
   * el token de autenticación en las cabeceras de la solicitud.
   *
   * @param cotizacionId El identificador de la cotización para la cual se obtienen los productos.
   * @returns Un observable que emite un array de objetos `CotizacionProductos`.
   * @throws Error Si no se encuentra el token de autenticación.
   */
  getProductosPorCotizacion(
    cotizacionId: number
  ): Observable<CotizacionProductos[]> {
    // Obtener el token de autenticación del servicio AuthService
    const token = this.authService.getToken();

    // Verificar si se obtuvo el token
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    // Crear las cabeceras de la solicitud incluyendo el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud GET a la API y retornar el observable
    return this.http.get<CotizacionProductos[]>(
      `${this.cotizacionProductoApiUrl}/listar-por-cotizacion/${cotizacionId}`,
      { headers }
    );
  }

  /**
   * Crea una nueva cotización con los productos asociados.
   *
   * Este método realiza una solicitud POST a la API para crear una nueva cotización,
   * incluyendo los productos asociados a la cotización en el cuerpo de la solicitud.
   * El token de autenticación se incluye en las cabeceras para autorizar la acción.
   *
   * @param cotizacion El objeto `Cotizacion` que contiene la información de la cotización a registrar.
   * @param productos Un array de objetos `CotizacionProductos` que contiene los productos asociados a la cotización.
   * @returns Un observable que emite una cadena de texto con la respuesta de la API.
   * @throws Error Si no se encuentra el token de autenticación o si ocurre un error en la API.
   */
  crearCotizacion(
    cotizacion: Cotizacion,
    productos: CotizacionProductos[]
  ): Observable<string> {
    // Obtener el token de autenticación del servicio AuthService
    const token = this.authService.getToken();

    // Verificar si se obtuvo el token
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    // Crear las cabeceras de la solicitud incluyendo el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Combinar la cotización y los productos en un solo objeto
    const cotizacionConProductos = {
      ...cotizacion,
      productos: productos,
    };

    // Realizar la solicitud POST a la API para crear la cotización
    return this.http
      .post(`${this.cotizacionApiUrl}/registrar`, cotizacionConProductos, {
        headers,
        responseType: 'text', // Indicamos que la respuesta será un texto
      })
      .pipe(
        tap((response) => {
          console.log('Respuesta del servidor:', response);
        }),
        catchError((error) => {
          console.error('Error al crear la cotización:', error);
          return throwError(
            () => new Error('Hubo un problema al registrar la cotización.')
          );
        })
      );
  }

  /**
   * Crea nuevos productos para una cotización.
   *
   * Este método realiza una solicitud POST a la API para crear los productos asociados
   * a una cotización específica. El token de autenticación se incluye en las cabeceras
   * de la solicitud para autorizar la acción.
   *
   * @param cotizacionProducto Un array de objetos `CotizacionProductos` que contiene los productos
   *                            que se desean agregar a la cotización.
   * @returns Un observable que emite un array de objetos `CotizacionProductos` con los productos creados.
   * @throws Error Si no se encuentra el token de autenticación.
   */
  crearProductosCotizacion(
    cotizacionProducto: CotizacionProductos[]
  ): Observable<CotizacionProductos[]> {
    // Obtener el token de autenticación del servicio AuthService
    const token = this.authService.getToken();

    // Verificar si se obtuvo el token
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    // Crear las cabeceras de la solicitud incluyendo el token de autenticación
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud POST a la API para crear los productos
    return this.http.post<CotizacionProductos[]>(
      this.cotizacionProductoApiUrl,
      cotizacionProducto,
      { headers }
    );
  }
}
