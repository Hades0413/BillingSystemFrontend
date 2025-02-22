import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../shared/empresa.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private empresaApiUrl = environment.empresaApiUrl;

  constructor(private http: HttpClient) {}

  registerEmpresa(empresa: Empresa): Observable<any> {
    return this.http.post(`${this.empresaApiUrl}/registrar`, empresa);
  }
}
