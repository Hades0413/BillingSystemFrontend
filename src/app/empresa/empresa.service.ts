import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../shared/empresa.model';
import { environment } from '../../environments/environment';

/**
 * Servicio encargado de gestionar las operaciones relacionadas con las empresas.
 *
 * Este servicio interactúa con la API para registrar empresas, listar empresas por su RUC,
 * y obtener una lista de todas las empresas registradas.
 */
@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  // URL base de la API de empresas
  private empresaApiUrl = environment.empresaApiUrl;

  /**
   * Constructor del servicio `EmpresaService`.
   *
   * @param http Instancia de `HttpClient` para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene las cabeceras de autenticación (vacías en este caso, se pueden modificar si es necesario).
   *
   * @returns Las cabeceras de la solicitud, que por ahora están vacías.
   */
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  /**
   * Registra una nueva empresa.
   *
   * Este método realiza una solicitud POST para registrar una nueva empresa en la base de datos.
   *
   * @param empresa El objeto `Empresa` que contiene los detalles de la empresa a registrar.
   * @returns Un observable que emite la respuesta de la API.
   */
  registerEmpresa(empresa: Empresa): Observable<any> {
    // Obtener las cabeceras para la solicitud (vacías en este caso)
    const headers = this.getAuthHeaders();

    // Realizar la solicitud POST para registrar la empresa
    return this.http.post(`${this.empresaApiUrl}/registrar`, empresa, {
      headers,
    });
  }

  /**
   * Lista las empresas registradas que coinciden con el RUC proporcionado.
   *
   * Este método realiza una solicitud GET para obtener las empresas que tienen el mismo RUC.
   *
   * @param ruc El RUC de la empresa para la cual se desean obtener los registros.
   * @returns Un observable que emite una lista de empresas que coinciden con el RUC proporcionado.
   */
  listarPorRuc(ruc: string): Observable<Empresa[]> {
    // Obtener las cabeceras para la solicitud
    const headers = this.getAuthHeaders();

    // Realizar la solicitud GET para obtener empresas por RUC
    return this.http.get<Empresa[]>(
      `${this.empresaApiUrl}/listar-por-ruc/${ruc}`,
      { headers }
    );
  }

  /**
   * Lista todas las empresas registradas en la base de datos.
   *
   * Este método realiza una solicitud GET para obtener todas las empresas registradas.
   *
   * @returns Un observable que emite una lista de todas las empresas.
   */
  listarEmpresas(): Observable<Empresa[]> {
    // Obtener las cabeceras para la solicitud
    const headers = this.getAuthHeaders();

    // Realizar la solicitud GET para obtener todas las empresas
    return this.http.get<Empresa[]>(`${this.empresaApiUrl}/listar`, {
      headers,
    });
  }
}
