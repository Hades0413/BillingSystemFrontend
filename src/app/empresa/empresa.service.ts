import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../shared/empresa.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private empresaApiUrl = environment.empresaApiUrl;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  registerEmpresa(empresa: Empresa): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.empresaApiUrl}/registrar`, empresa, {
      headers,
    });
  }

  listarPorRuc(ruc: string): Observable<Empresa[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Empresa[]>(
      `${this.empresaApiUrl}/listar-por-ruc/${ruc}`,
      { headers }
    );
  }

  listarEmpresas(): Observable<Empresa[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Empresa[]>(`${this.empresaApiUrl}/listar`, {
      headers,
    });
  }
}
