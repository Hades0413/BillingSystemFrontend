import { Component, OnInit } from '@angular/core';
import { VentaService } from './venta.service';
import { ClienteService } from '../cliente/cliente.service';
import { Venta } from '../shared/venta.model';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TipoComprobanteService } from '../tipo-comprobante/tipo-comprobante.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
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
    FormsModule,
  ],
})
export class FacturaComponent implements OnInit {
  ventas: any[] = [];
  clientes: any[] = [];
  usuarios: any[] = [];
  tipocomprobante: any[] = [];
  clienteMap: { [key: number]: string } = {};
  usuarioMap: { [key: number]: string } = {};
  tipocomprobanteMap: { [key: number]: string } = {};
  usuarioId: number = 0;

  isLoading: boolean = false;
  errorMessage: string = '';
  activeFilter: string = '';
  searchTerm: string = '';
  filterCodigo: string = '';
  filterPago: string = '';
  filterRuc: string = '';
  totalItems: number = 0;
  itemsPerPage: number = 10;
  currentPage: number = 0;
  paginatedFacturas: any[] = [];

  displayedColumns: string[] = [
    'VentaCodigo',
    'TipoComprobanteNombre',
    'VentaFecha',
    'ClienteNombreLegal',
    'VentaMontoTotal',
    'Acciones',
  ];

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private tipocomprobanteService: TipoComprobanteService
  ) {}

  ngOnInit(): void {
    const storedUsuarioId = localStorage.getItem('UsuarioId');
    if (storedUsuarioId) {
      this.usuarioId = parseInt(storedUsuarioId, 10);
      this.listarVentasPorUsuario(this.usuarioId);
    }
  }

  listarVentasPorUsuario(usuarioId: number): void {
    this.isLoading = true;
    this.ventaService.getVentasPorUsuario(usuarioId).subscribe(
      (response) => {
        this.isLoading = false;
        if (Array.isArray(response)) {
          this.ventas = response.map((venta: any) => ({
            VentaId: venta.ventaId,
            VentaVenta: venta.ventaVenta,
            VentaCodigo: venta.ventaCodigo,
            VentaFecha: venta.ventaFecha,
            VentaMontoTotal: venta.ventaMontoTotal,
            VentaMontoDescuento: venta.ventaMontoDescuento,
            VentaMontoImpuesto: venta.ventaMontoImpuesto,
            FormaPago: venta.FormaPago,
            ClienteRuc: venta.ClienteRuc,
            TipoComprobanteId: venta.tipoComprobanteId,
            UsuarioId: venta.usuarioId,
            EmpresaId: venta.empresaId,
            ClienteId: venta.clienteId,
          }));

          this.paginateSales();
          this.obtenerClientes();
          this.obtenerTiposDeComprobante();
          this.obtenerUsuarios();
        } else {
          this.errorMessage = 'La respuesta no es un array';
        }
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = 'Error al obtener ventas';
      }
    );
  }

  obtenerClientes(): void {
    this.clienteService.getClientes().subscribe(
      (clientes) => {
        this.clientes = clientes;
        this.crearClienteMap();
      },
      (error) => {
        this.errorMessage = 'Error al obtener clientes';
      }
    );
  }

  obtenerTiposDeComprobante(): void {
    this.tipocomprobanteService.getTipoComprobantes().subscribe(
      (tipocomprobante) => {
        this.tipocomprobante = tipocomprobante;
        this.crearTipoComprobanteMap();
      },
      (error) => {
        this.errorMessage = 'Error al obtener tipos de comprobantes';
      }
    );
  }

  obtenerUsuarios(): void {
    this.authService.listarUsuarios().subscribe(
      (response) => {
        if (response && Array.isArray(response.data)) {
          this.usuarios = response.data;
          this.crearUsuarioMap();
        } else {
          this.errorMessage =
            'La respuesta de usuarios no contiene datos válidos';
        }
      },
      (error) => {
        this.errorMessage = 'Error al obtener usuarios';
      }
    );
  }

  crearTipoComprobanteMap(): void {
    this.tipocomprobante.forEach((tipocomprobante) => {
      if (tipocomprobante && tipocomprobante.tipoComprobanteId !== undefined) {
        this.tipocomprobanteMap[tipocomprobante.tipoComprobanteId] =
          tipocomprobante.tipoComprobanteNombre;
      }
    });
  }

  crearUsuarioMap(): void {
    this.usuarios.forEach((usuario) => {
      if (usuario && usuario.usuarioId !== undefined) {
        this.usuarioMap[
          usuario.usuarioId
        ] = `${usuario.usuarioNombres} ${usuario.usuarioApellidos}`;
      }
    });
  }

  crearClienteMap(): void {
    this.clientes.forEach((cliente) => {
      if (cliente && cliente.clienteId !== undefined) {
        this.clienteMap[cliente.clienteId] = cliente.clienteNombreLegal;
      }
    });
  }

  obtenerClienteNombreLegal(clienteId: number): string {
    return this.clienteMap[clienteId] || 'Cliente no encontrado';
  }

  obtenerUsuarioNombre(usuarioId: number): string {
    return this.usuarioMap[usuarioId] || 'Usuario no encontrado';
  }

  obtenerTipoComprobante(tipoComprobanteId: number): string {
    return (
      this.tipocomprobanteMap[tipoComprobanteId] ||
      'Tipo de comprobante no encontrado'
    );
  }

  toggleFilter(filterType: string): void {
    this.activeFilter = this.activeFilter === filterType ? '' : filterType;
    this.paginateSales();
  }

  paginateSales(): void {
    let filteredData = [...this.ventas];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter((venta) =>
        Object.values(venta).some((value) =>
          String(value).toLowerCase().includes(term)
        )
      );
    }

    if (this.filterCodigo) {
      filteredData = filteredData.filter((venta) =>
        venta.VentaCodigo.toLowerCase().includes(
          this.filterCodigo.toLowerCase()
        )
      );
    }

    if (this.filterPago) {
      filteredData = filteredData.filter((venta) =>
        venta.FormaPago.toLowerCase().includes(this.filterPago.toLowerCase())
      );
    }

    if (this.filterRuc) {
      filteredData = filteredData.filter((venta) =>
        venta.ClienteRuc.toString().includes(this.filterRuc)
      );
    }

    filteredData = filteredData.map((venta) => {
      const tipoComprobanteId = Number(venta.TipoComprobanteId);
      const tipoComprobante = this.tipocomprobanteMap[tipoComprobanteId];

      return {
        ...venta,
        TipoComprobanteNombre: tipoComprobante || 'Comprobante no encontrado',
      };
    });

    this.totalItems = filteredData.length;
    const startIndex = this.currentPage * this.itemsPerPage;
    this.paginatedFacturas = filteredData.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.paginateSales();
  }

  verDetalles(venta: Venta): void {
    alert(
      `Detalles de la venta:\nCódigo: ${venta.VentaCodigo}\nFecha: ${venta.VentaFecha}\nMonto Total: ${venta.VentaMontoTotal}`
    );
  }
}
