import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { Cliente } from '../shared/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private clienteApiUrl = environment.clienteApiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getClientes(): Observable<Cliente[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Cliente[]>(`${this.clienteApiUrl}/listar`, { headers });
  }

  // Método para listar clientes por nombre legal
  getClientesPorNombre(nombre: string): Observable<Cliente[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Cliente[]>(`${this.clienteApiUrl}/listar/nombre/${nombre}`, { headers });
  }
}
