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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VentaDetalleComponent } from './venta-detalle.component';
import { EmpresaService } from '../empresa/empresa.service';
import { Router } from '@angular/router';

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
    MatSortModule,
    FormsModule,
    MatDialogModule,
    VentaDetalleComponent,
  ],
})
export class VentaComponent implements OnInit {
  ventas: Venta[] = [];
  clientes: any[] = [];
  usuarios: any[] = [];
  empresas: any[] = [];
  clienteMap: { [key: number]: string } = {};
  usuarioMap: { [key: number]: string } = {};
  empresaMap: { [key: number]: string } = {};
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
  paginatedVentas: any[] = [];

  displayedColumns: string[] = [
    'VentaVenta',
    'ClienteNombreLegal',
    'VentaMontoTotal',
    'VentaFecha',
    'VentaCodigo',
    'UsuarioNombre',
    'Acciones',
  ];

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private empresaService: EmpresaService,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUsuarioId = localStorage.getItem('UsuarioId');
    if (storedUsuarioId) {
      this.usuarioId = parseInt(storedUsuarioId, 10);
      this.listarVentasPorUsuario(this.usuarioId);
    }
  }

  listarVentasPorUsuario(usuarioId: number): void {
    this.ventaService.getVentasPorUsuario(usuarioId).subscribe(
      (response) => {
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

          this.clienteService.getClientes().subscribe(
            (clientes) => {
              this.clientes = clientes;
              this.crearClienteMap();
            },
            (error) => {
              this.errorMessage = 'Error al obtener clientes';
            }
          );

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

          this.empresaService.listarEmpresas().subscribe(
            (empresas) => {
              this.empresas = empresas;
              this.crearEmpresaMap();
            },
            (error) => {
              this.errorMessage = 'Error al obtener empresas';
            }
          );
        } else {
          this.errorMessage = 'La respuesta no es un array';
        }
      },
      (error) => {
        this.errorMessage = 'Error al obtener ventas';
      }
    );
  }

  crearClienteMap(): void {
    this.clientes.forEach((cliente) => {
      if (cliente && cliente.clienteId !== undefined) {
        this.clienteMap[cliente.clienteId] = cliente.clienteNombreLegal;
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

  crearEmpresaMap(): void {
    this.empresas.forEach((empresa) => {
      if (empresa && empresa.empresaId !== undefined) {
        this.empresaMap[empresa.empresaId] = empresa.empresaNombreComercial;
      }
    });
  }

  obtenerClienteNombreLegal(clienteId: number): string {
    return this.clienteMap[clienteId] || 'Cliente no encontrado';
  }

  obtenerUsuarioNombre(usuarioId: number): string {
    return this.usuarioMap[usuarioId] || 'Usuario no encontrado';
  }

  obtenerEmpresaNombreComercial(empresaId: number): string {
    return this.empresaMap[empresaId] || 'Empresa no encontrada';
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

    this.totalItems = filteredData.length;
    const startIndex = this.currentPage * this.itemsPerPage;
    this.paginatedVentas = filteredData.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.paginateSales();
  }

  verDetallesVenta(venta: Venta): void {
    const clienteNombre = this.obtenerClienteNombreLegal(venta.ClienteId);
    const usuarioNombres = this.obtenerUsuarioNombre(venta.UsuarioId);
    const empresaNombre = this.obtenerEmpresaNombreComercial(venta.EmpresaId);

    const ventaDetalles = {
      VentaId: venta.VentaId,
      VentaCodigo: venta.VentaCodigo,
      VentaFecha: venta.VentaFecha,
      VentaMontoTotal: venta.VentaMontoTotal,
      VentaMontoDescuento: venta.VentaMontoDescuento,
      VentaMontoImpuesto: venta.VentaMontoImpuesto,
      ClienteId: venta.ClienteId,
      UsuarioId: venta.UsuarioId,
      EmpresaId: venta.EmpresaId,
      ClienteNombre: clienteNombre,
      UsuarioNombre: usuarioNombres,
      EmpresaNombre: empresaNombre,
    };

    this.dialog.open(VentaDetalleComponent, {
      data: ventaDetalles,
      width: '800px',
    });
  }

  irACrearVenta(): void {
    this.router.navigate(['/crear-venta']);
  }
}
