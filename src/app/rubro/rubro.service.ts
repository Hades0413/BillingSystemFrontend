import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rubro } from '../shared/rubro.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RubroService {
  private rubroApiUrl = environment.rubroApiUrl;

  constructor(private http: HttpClient) {}

  getRubros(): Observable<Rubro[]> {
    return this.http.get<Rubro[]>(`${this.rubroApiUrl}/listar`);
  }
}
