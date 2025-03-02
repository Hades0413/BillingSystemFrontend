import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Venta } from '../shared/venta.model';
import { VentaProducto } from '../shared/venta-producto.model';
import { Producto } from '../shared/producto.model';
import { Router } from '@angular/router';
import { VentaService } from '../venta/venta.service';
import { ProductoService } from '../producto/producto.service';
import { MatGridListModule } from '@angular/material/grid-list';
import Swal from 'sweetalert2';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { ClienteService } from '../cliente/cliente.service';
import { Cliente } from '../shared/cliente.model';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-register-venta',
  templateUrl: './register-venta.component.html',
  styleUrls: ['./register-venta.component.css'],
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
    MatDialogModule,
    MatOption,
    MatFormFieldModule,
    MatSelectModule,
    MatGridListModule,
    MatMenuModule,
    MatListModule,
  ],
})
export class RegisterVentaComponent implements OnInit {
  venta: Venta = {
    VentaId: 0,
    VentaVenta: '',
    VentaCodigo: '',
    VentaFecha: new Date(),
    VentaMontoTotal: 0,
    VentaMontoDescuento: 0,
    VentaMontoImpuesto: 0,
    FormaPago: '',
    TipoComprobanteId: 0,
    ClienteRuc: '11111111111',
    UsuarioId: 0,
    EmpresaId: 1,
    ClienteId: 0,
  };
  clientes: Cliente[] = [];
  clientesEncontrados: Cliente[] = [];
  clienteNombre: string = '';
  DetallesVenta: VentaProducto[] = [];
  productosDisponibles: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  displayedColumns: string[] = [
    'producto',
    'cantidad',
    'precio',
    'total',
    'acciones',
  ];

  clienteSeleccionado: boolean = false;

  constructor(
    private ventaService: VentaService,
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarProductosDisponibles();
    this.agregarProducto();
  }

  buscarCliente(): void {
    if (this.clienteNombre.length > 2) {
      this.clienteService.getClientesPorNombre(this.clienteNombre).subscribe(
        (clientes: Cliente[]) => {
          this.clientesEncontrados = clientes;
        },
        (error) => {
          this.errorMessage = 'Error al buscar clientes';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.errorMessage,
          });
        }
      );
    } else {
      this.clientesEncontrados = [];
    }
  }

  seleccionarCliente(cliente: Cliente): void {
    this.venta.ClienteId = cliente.clienteId;
    this.venta.ClienteRuc = cliente.clienteRuc;
    this.clienteNombre = cliente.clienteNombreLegal;
    this.clientesEncontrados = [];
    this.clienteSeleccionado = true;
  }

  // Agregado: Método para deseleccionar el cliente
  deseleccionarCliente(): void {
    this.clienteSeleccionado = false;
    this.clienteNombre = '';
    this.venta.ClienteId = 0;
    this.venta.ClienteRuc = '11111111111';
  }

  cargarClientes(): void {
    this.clienteService.getClientes().subscribe(
      (response: Cliente[]) => {
        this.clientes = response;
      },
      () => {
        this.errorMessage = 'Error al cargar los clientes';
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage,
        });
      }
    );
  }

  cargarProductosDisponibles(): void {
    const usuarioId = parseInt(localStorage.getItem('UsuarioId')!, 10);

    if (usuarioId) {
      this.venta.UsuarioId = usuarioId;
      this.productoService.getProductosPorUsuario(usuarioId).subscribe(
        (response: any) => {
          this.productosDisponibles = response.data;
        },
        () => {
          this.errorMessage = 'Error al cargar los productos';
          this.isLoading = false;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.errorMessage,
          });
        }
      );
    } else {
      this.errorMessage = 'Usuario no autenticado.';
      this.isLoading = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: this.errorMessage,
      });
    }
  }

  crearVenta(): void {
    this.isLoading = true;
    this.calcularTotalVenta();

    const ventaConDetalles = {
      VentaId: 0,
      VentaVenta: '',
      VentaCodigo: '',
      VentaFecha: new Date(),
      VentaMontoTotal: this.venta.VentaMontoTotal,
      VentaMontoDescuento: this.venta.VentaMontoDescuento,
      VentaMontoImpuesto: this.venta.VentaMontoImpuesto,
      FormaPago: this.venta.FormaPago,
      TipoComprobanteId: this.venta.TipoComprobanteId,
      ClienteRuc: this.venta.ClienteRuc,
      UsuarioId: this.venta.UsuarioId,
      EmpresaId: this.venta.EmpresaId,
      ClienteId: this.venta.ClienteId,
      DetallesVenta: this.DetallesVenta.map((detalle) => ({
        VentaProductoId: 0,
        VentaId: 0,
        ProductoId: detalle.ProductoId,
        Cantidad: detalle.Cantidad,
        PrecioUnitario: detalle.PrecioUnitario,
        Total: detalle.Total,
      })),
    };

    this.ventaService
      .crearVenta(ventaConDetalles, ventaConDetalles.DetallesVenta)
      .subscribe(
        (response: string) => {
          this.successMessage = response;
          this.isLoading = false;
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: this.successMessage,
          });
          this.router.navigate(['/ventas']);
        },
        (error) => {
          this.isLoading = false;
          if (error.status === 400) {
            this.errorMessage =
              'Error 400: Validación fallida. Verifique los datos enviados.';
            Swal.fire({
              icon: 'error',
              title: 'Error 400',
              text: this.errorMessage,
            });
          } else if (error.status === 500) {
            this.errorMessage =
              'Error 500: Problema en el servidor. Intente de nuevo más tarde.';
            Swal.fire({
              icon: 'error',
              title: 'Error 500',
              text: this.errorMessage,
            });
          } else {
            this.errorMessage = `Error desconocido: ${
              error.message || 'Ocurrió un problema inesperado.'
            }`;
            Swal.fire({
              icon: 'error',
              title: 'Error desconocido',
              text: this.errorMessage,
            });
          }
        }
      );
  }

  agregarProducto(): void {
    this.DetallesVenta.push({
      VentaProductoId: 0,
      VentaId: 0,
      ProductoId: 0,
      Cantidad: 0,
      PrecioUnitario: 0,
      Total: 0,
    });
  }

  eliminarProducto(index: number): void {
    this.DetallesVenta.splice(index, 1);
    this.calcularTotalVenta();
  }

  actualizarProducto(index: number): void {
    const productoId = this.DetallesVenta[index].ProductoId;
    const productoSeleccionado = this.productosDisponibles.find(
      (producto) => producto.productoId === productoId
    );
    if (productoSeleccionado) {
      this.DetallesVenta[index].PrecioUnitario =
        productoSeleccionado.productoPrecioVenta;
      this.calcularTotal(index);
    }
  }

  calcularTotal(index: number): void {
    const producto = this.DetallesVenta[index];
    const productoId = producto.ProductoId;
    const productoSeleccionado = this.productosDisponibles.find(
      (producto) => producto.productoId === productoId
    );

    if (productoSeleccionado) {
      const precioConIgv =
        producto.PrecioUnitario + productoSeleccionado.productoImpuestoIgv;
      producto.Total = precioConIgv * producto.Cantidad;
    }
    this.calcularTotalVenta();
  }

  calcularTotalVenta(): void {
    let subtotal = 0;
    this.DetallesVenta.forEach((producto) => {
      subtotal += producto.Total;
    });

    const descuentoMonto = (this.venta.VentaMontoDescuento / 100) * subtotal;
    const impuesto = (subtotal - descuentoMonto) * 0.18;
    this.venta.VentaMontoImpuesto = parseFloat(impuesto.toFixed(2));
    this.venta.VentaMontoTotal = parseFloat(
      (subtotal - descuentoMonto + impuesto).toFixed(2)
    );
  }

  calcularTotalConDescuento(): void {
    this.calcularTotalVenta();
  }
}
