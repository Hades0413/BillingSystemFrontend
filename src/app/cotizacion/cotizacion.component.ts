import { Component, OnInit } from '@angular/core';
import { CotizacionService } from './cotizacion.service';
import { ClienteService } from '../cliente/cliente.service';
import { AuthService } from '../auth/auth.service';
import { Cotizacion } from '../shared/cotizacion.model';
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
import { CotizacionDetalleComponent } from './cotizacion-detalle.component';
import { EmpresaService } from '../empresa/empresa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.css'],
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
    CotizacionDetalleComponent,
  ],
})
export class CotizacionComponent implements OnInit {
  cotizaciones: Cotizacion[] = [];
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
  filterCliente: string = '';
  filterEmpresa: string = '';
  totalItems: number = 0;
  itemsPerPage: number = 10;
  currentPage: number = 0;
  paginatedCotizaciones: Cotizacion[] = [];

  displayedColumns: string[] = [
    'CotizacionCodigo',
    'CotizacionFecha',
    'CotizacionMontoTotal',
    'CotizacionMontoDescuento',
    'CotizacionMontoImpuesto',
    'ClienteNombre',
    'Acciones',
  ];

  constructor(
    private cotizacionService: CotizacionService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private empresaService: EmpresaService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUsuarioId = localStorage.getItem('UsuarioId');
    if (storedUsuarioId) {
      this.usuarioId = parseInt(storedUsuarioId, 10);
      this.listarCotizacionesPorUsuario(this.usuarioId);
    }
  }

  listarCotizacionesPorUsuario(usuarioId: number): void {
    this.cotizacionService.getCotizacionesPorUsuario(usuarioId).subscribe(
      (response) => {
        if (Array.isArray(response)) {
          this.cotizaciones = response.map((cotizacion: any) => ({
            CotizacionId: cotizacion.cotizacionId,
            CotizacionCodigo: cotizacion.cotizacionCodigo,
            CotizacionFecha: cotizacion.cotizacionFecha,
            CotizacionMontoTotal: cotizacion.cotizacionMontoTotal,
            CotizacionMontoDescuento: cotizacion.cotizacionMontoDescuento,
            CotizacionMontoImpuesto: cotizacion.cotizacionMontoImpuesto,
            ClienteId: cotizacion.clienteId,
            UsuarioId: cotizacion.usuarioId,
            EmpresaId: cotizacion.empresaId,
          }));

          this.paginateCotizaciones();

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
        this.errorMessage = 'Error al obtener cotizaciones';
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

  // Crear el mapa de empresas
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

  // Obtener el nombre comercial de la empresa
  obtenerEmpresaNombreComercial(empresaId: number): string {
    return this.empresaMap[empresaId] || 'Empresa no encontrada';
  }

  toggleFilter(filterType: string): void {
    this.activeFilter = this.activeFilter === filterType ? '' : filterType;
    this.paginateCotizaciones();
  }

  paginateCotizaciones(): void {
    let filteredData = [...this.cotizaciones];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filteredData = filteredData.filter((cotizacion) =>
        Object.values(cotizacion).some((value) =>
          String(value).toLowerCase().includes(term)
        )
      );
    }

    if (this.filterCodigo) {
      filteredData = filteredData.filter((cotizacion) =>
        cotizacion.CotizacionCodigo.toLowerCase().includes(
          this.filterCodigo.toLowerCase()
        )
      );
    }

    if (this.filterCliente) {
      filteredData = filteredData.filter((cotizacion) =>
        cotizacion.ClienteId.toString().includes(this.filterCliente)
      );
    }

    if (this.filterEmpresa) {
      filteredData = filteredData.filter((cotizacion) =>
        cotizacion.EmpresaId.toString().includes(this.filterEmpresa)
      );
    }

    this.totalItems = filteredData.length;
    const startIndex = this.currentPage * this.itemsPerPage;
    this.paginatedCotizaciones = filteredData.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  changePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
    this.paginateCotizaciones();
  }

  verDetalles(cotizacion: Cotizacion): void {
    const clienteNombre = this.obtenerClienteNombreLegal(cotizacion.ClienteId);
    const usuarioNombres = this.obtenerUsuarioNombre(cotizacion.UsuarioId);
    const empresaNombreComercial = this.obtenerEmpresaNombreComercial(
      cotizacion.EmpresaId
    );

    const cotizacionDetalles = {
      CotizacionId: cotizacion.CotizacionId,
      CotizacionCodigo: cotizacion.CotizacionCodigo,
      CotizacionFecha: cotizacion.CotizacionFecha,
      CotizacionMontoTotal: cotizacion.CotizacionMontoTotal,
      CotizacionMontoDescuento: cotizacion.CotizacionMontoDescuento,
      CotizacionMontoImpuesto: cotizacion.CotizacionMontoImpuesto,
      ClienteId: cotizacion.ClienteId,
      UsuarioId: cotizacion.UsuarioId,
      EmpresaId: cotizacion.EmpresaId,
      ClienteNombre: clienteNombre,
      UsuarioNombre: usuarioNombres,
      EmpresaNombreComercial: empresaNombreComercial,
    };

    // Abrimos el modal y le pasamos los datos
    this.dialog.open(CotizacionDetalleComponent, {
      data: cotizacionDetalles,
      width: '800px',
    });
  }

  irACrearCotizacion(): void {
    this.router.navigate(['/crear-cotizacion']);
  }
}
