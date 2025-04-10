import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rubro } from '../shared/rubro.model';
import { environment } from '../../environments/environment';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con los rubros.
 *
 * Este servicio interactúa con la API para obtener la lista de rubros disponibles.
 */
@Injectable({
  providedIn: 'root',
})
export class RubroService {
  // URL base de la API de rubros
  private rubroApiUrl = environment.rubroApiUrl;

  /**
   * Constructor del servicio `RubroService`.
   *
   * @param http Instancia de `HttpClient` para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de rubros registrados en la base de datos.
   *
   * Este método realiza una solicitud GET a la API para obtener todos los rubros.
   *
   * @returns Un observable que emite la lista de rubros.
   */
  getRubros(): Observable<Rubro[]> {
    // Realizar la solicitud GET para obtener todos los rubros
    return this.http.get<Rubro[]>(`${this.rubroApiUrl}/listar`);
  }
}
