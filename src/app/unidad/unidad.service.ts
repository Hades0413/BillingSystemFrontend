import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Unidad } from '../shared/unidad.model';

@Injectable({
  providedIn: 'root',
})
export class UnidadService {
  private unidadApiUrl = environment.unidadApiUrl;

  constructor(private http: HttpClient) {}

  getUnidades(): Observable<Unidad[]> {
    return this.http.get<Unidad[]>(`${this.unidadApiUrl}/listar`);
  }
}
