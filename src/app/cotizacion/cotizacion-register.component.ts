import { Component, OnInit } from '@angular/core';
import { Cotizacion } from '../shared/cotizacion.model';
import { CotizacionProductos } from '../shared/cotizacion-producto.model';
import { Producto } from '../shared/producto.model';
import { Router } from '@angular/router';
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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { CotizacionService } from '../cotizacion/cotizacion.service';
import { ProductoService } from '../producto/producto.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface ProductoResponse {
  data: Producto[];
}

@Component({
  selector: 'app-cotizacion-register',
  templateUrl: './cotizacion-register.component.html',
  styleUrls: ['./cotizacion-register.component.css'],
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
    MatDatepickerModule,
    MatNativeDateModule
  ],
})
export class CotizacionRegisterComponent implements OnInit {
  cotizacion: Cotizacion = {
    CotizacionId: 0,
    CotizacionCodigo: '',
    CotizacionFecha: new Date(),
    CotizacionMontoTotal: 0,
    CotizacionMontoDescuento: 0,
    CotizacionMontoImpuesto: 0,
    UsuarioId: 0,
    EmpresaId: 1,
    ClienteId: 0,
  };

  productos: CotizacionProductos[] = [];
  productosDisponibles: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Columnas para la tabla de productos
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'total', 'acciones'];

  constructor(
    private cotizacionService: CotizacionService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductosDisponibles();
  }

  cargarProductosDisponibles(): void {
    const usuarioId = parseInt(localStorage.getItem('UsuarioId')!, 10);

    if (usuarioId) {
      this.cotizacion.UsuarioId = usuarioId;
      this.productoService.getProductosPorUsuario(usuarioId).subscribe(
        (response: ProductoResponse) => {
          this.productosDisponibles = response.data;
        },
        () => {
          this.errorMessage = 'Error al cargar los productos';
          this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = 'Usuario no autenticado.';
      this.isLoading = false;
    }
  }

  crearCotizacion(): void {
    if (this.validarFormulario()) {
      this.isLoading = true;
      this.calcularTotalCotizacion();

      this.cotizacionService.crearCotizacion(this.cotizacion, this.productos).subscribe(
        () => {
          this.successMessage = 'Cotización creada con éxito';
          this.isLoading = false;
          this.router.navigate(['/ventas']);
        },
        () => {
          this.isLoading = false;
          this.errorMessage = 'Error al crear la cotización';
        }
      );
    }
  }

  validarFormulario(): boolean {
    if (!this.cotizacion.ClienteId) {
      this.errorMessage = 'Por favor, seleccione un cliente';
      return false;
    }

    if (this.productos.length === 0) {
      this.errorMessage = 'Por favor, agregue al menos un producto';
      return false;
    }

    if (this.productos.some(p => !p.ProductoId || p.Cantidad <= 0)) {
      this.errorMessage = 'Por favor, complete todos los campos de productos y asegúrese que las cantidades sean mayores a 0';
      return false;
    }

    return true;
  }

  agregarProducto(): void {
    this.productos.push({
      CotizacionProductoId: 0,
      CotizacionId: 0,
      ProductoId: 0,
      Cantidad: 0,
      PrecioUnitario: 0,
      Total: 0,
    });
  }

  eliminarProducto(index: number): void {
    this.productos.splice(index, 1);
    this.calcularTotalCotizacion();
  }

  actualizarProducto(index: number): void {
    const productoId = this.productos[index].ProductoId;
    const productoSeleccionado = this.productosDisponibles.find(
      (producto) => producto.productoId === productoId
    );
    if (productoSeleccionado) {
      this.productos[index].PrecioUnitario = productoSeleccionado.productoPrecioVenta;
      this.calcularTotal(index);
    }
  }

  calcularTotal(index: number): void {
    const producto = this.productos[index];
    const productoId = producto.ProductoId;
    const productoSeleccionado = this.productosDisponibles.find(
      (producto) => producto.productoId === productoId
    );

    if (productoSeleccionado) {
      const precioConIgv = producto.PrecioUnitario + productoSeleccionado.productoImpuestoIgv;
      producto.Total = precioConIgv * producto.Cantidad;
    }
    this.calcularTotalCotizacion();
  }

  calcularTotalCotizacion(): void {
    let subtotal = 0;
    this.productos.forEach((producto) => {
      subtotal += producto.Total;
    });

    const descuentoMonto = (this.cotizacion.CotizacionMontoDescuento / 100) * subtotal;
    const impuesto = (subtotal - descuentoMonto) * 0.18;
    this.cotizacion.CotizacionMontoImpuesto = parseFloat(impuesto.toFixed(2));
    this.cotizacion.CotizacionMontoTotal = parseFloat(
      (subtotal - descuentoMonto + impuesto).toFixed(2)
    );
  }

  calcularTotalConDescuento(): void {
    this.calcularTotalCotizacion();
  }

  // Método para mostrar mensajes de error o éxito
  mostrarMensaje(mensaje: string, esError: boolean = false): void {
    if (esError) {
      this.errorMessage = mensaje;
      this.successMessage = '';
    } else {
      this.successMessage = mensaje;
      this.errorMessage = '';
    }
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }
}
