import { Component, OnInit } from '@angular/core';
import { VentaService } from './venta.service';
import { ClienteService } from '../cliente/cliente.service';
import { Venta } from '../shared/venta.model';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class VentaComponent implements OnInit {
  ventas: Venta[] = [];
  clientes: any[] = [];
  clienteMap: { [key: number]: string } = {};
  usuarioId: number = 0;

  // Añadimos más columnas para mostrar toda la información relevante
  displayedColumns: string[] = [
    'VentaCodigo',
    'VentaFecha',
    'VentaMontoTotal',
    'VentaMontoDescuento',
    'VentaMontoImpuesto',
    'VentaFormaPago',
    'VentaRucCliente',
    'TipoComprobanteId',
    'UsuarioId',
    'EmpresaId',
    'ClienteNombreLegal',
  ];

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const storedUsuarioId = localStorage.getItem('UsuarioId');
    if (storedUsuarioId) {
      this.usuarioId = parseInt(storedUsuarioId, 10);
      this.listarVentasPorUsuario(this.usuarioId);
    } else {
      console.error('Usuario no autenticado.');
    }
  }

  listarVentasPorUsuario(usuarioId: number): void {
    this.ventaService.getVentasPorUsuario(usuarioId).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.ventas = response.map((venta: any) => ({
            VentaId: venta.ventaId,
            VentaCodigo: venta.ventaCodigo,
            VentaFecha: venta.ventaFecha,
            VentaMontoTotal: venta.ventaMontoTotal,
            VentaMontoDescuento: venta.ventaMontoDescuento,
            VentaMontoImpuesto: venta.ventaMontoImpuesto,
            VentaFormaPago: venta.ventaFormaPago,
            VentaRucCliente: venta.ventaRucCliente,
            TipoComprobanteId: venta.tipoComprobanteId,
            UsuarioId: venta.usuarioId,
            EmpresaId: venta.empresaId,
            ClienteId: venta.clienteId,
          }));

          this.clienteService.getClientes().subscribe(
            (clientes) => {
              this.clientes = clientes;
              this.crearClienteMap();
            },
            (error) => {
              console.error('Error al obtener clientes:', error);
            }
          );
        } else {
          console.error('La respuesta no es un array');
        }
      },
      (error) => {
        console.error('Error al obtener ventas:', error);
      }
    );
  }

  crearClienteMap(): void {
    this.clientes.forEach((cliente) => {
      if (cliente && cliente.clienteId !== undefined) {
        this.clienteMap[cliente.clienteId] = cliente.clienteNombreLegal;
      } else {
        console.warn('Cliente sin clienteId:', cliente);
      }
    });
  }

  obtenerClienteNombreLegal(clienteId: number): string {
    return this.clienteMap[clienteId] || 'Cliente no encontrado';
  }
}
