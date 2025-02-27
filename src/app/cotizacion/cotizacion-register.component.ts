import { Component, OnInit } from '@angular/core';
import { Cotizacion } from '../shared/cotizacion.model';
import { CotizacionProductos } from '../shared/cotizacion-producto.model';
import { Producto } from '../shared/producto.model';
import { Router } from '@angular/router';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { CotizacionService } from '../cotizacion/cotizacion.service';
import { ProductoService } from '../producto/producto.service';

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
    MatSortModule,
    FormsModule,
    MatDialogModule,
    MatOption,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class CotizacionRegisterComponent implements OnInit {
  cotizacion: Cotizacion = {
    CotizacionId: 0, // Se genera automáticamente, no se envía
    CotizacionCodigo: '', // Se genera automáticamente, no se envía
    CotizacionFecha: new Date(),
    CotizacionMontoTotal: 0,
    CotizacionMontoDescuento: 0, // Este es el porcentaje de descuento
    CotizacionMontoImpuesto: 0,
    UsuarioId: 0, // Se asignará más abajo usando localStorage
    EmpresaId: 1, // Ajusta según tu empresa
    ClienteId: 0,
  };

  productos: CotizacionProductos[] = [];
  productosDisponibles: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

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
      this.cotizacion.UsuarioId = usuarioId; // Asignamos el UsuarioId desde localStorage

      this.productoService.getProductosPorUsuario(usuarioId).subscribe(
        (response: ProductoResponse) => {
          this.productosDisponibles = response.data;
          console.log(
            'Productos encontrados para el UsuarioId',
            usuarioId,
            ':',
            this.productosDisponibles
          );
        },
        (error) => {
          this.errorMessage = 'Error al cargar los productos';
          this.isLoading = false;
          console.error('Error al cargar los productos:', error);
        }
      );
    } else {
      this.errorMessage = 'Usuario no autenticado.';
      this.isLoading = false;
    }
  }

  crearCotizacion(): void {
    this.isLoading = true;

    // Lógica para calcular el monto total
    this.calcularTotalCotizacion();

    console.log('Datos a enviar para crear la cotización:', {
      cotizacion: this.cotizacion,
      productos: this.productos,
    });

    this.cotizacionService
      .crearCotizacion(this.cotizacion, this.productos)
      .subscribe(
        (response) => {
          this.successMessage = 'Cotización creada con éxito';
          this.isLoading = false;
          this.router.navigate(['/ventas']);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al crear la cotización';
          console.error('Error al crear la cotización:', error);
        }
      );
  }

  agregarProducto(): void {
    this.productos.push({
      CotizacionProductoId: 0, // Se genera automáticamente, no se envía
      CotizacionId: 0, // Se genera automáticamente, no se envía
      ProductoId: 0,
      Cantidad: 0,
      PrecioUnitario: 0,
      Total: 0,
    });
  }

  eliminarProducto(index: number): void {
    this.productos.splice(index, 1);
    this.calcularTotalCotizacion(); // Recalcular total al eliminar un producto
  }

  actualizarProducto(index: number): void {
    const productoId = this.productos[index].ProductoId;
    const productoSeleccionado = this.productosDisponibles.find(
      (producto) => producto.productoId === productoId
    );
    if (productoSeleccionado) {
      this.productos[index].PrecioUnitario =
        productoSeleccionado.productoPrecioVenta;
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
      // El precio unitario final incluye el impuesto (ProductoImpuestoIgv)
      const precioConIgv = producto.PrecioUnitario + productoSeleccionado.productoImpuestoIgv;

      // El total de este producto se calcula como precioConIgv * cantidad
      producto.Total = precioConIgv * producto.Cantidad;
    }
    this.calcularTotalCotizacion(); // Recalcular total al actualizar un producto
  }

  // Función para calcular el monto total de la cotización
  calcularTotalCotizacion(): void {
    let subtotal = 0;
    this.productos.forEach((producto) => {
      subtotal += producto.Total;
    });

    // Calcular el descuento (en porcentaje)
    const descuentoMonto = (this.cotizacion.CotizacionMontoDescuento / 100) * subtotal;

    // Calcular el impuesto (18%) sobre el subtotal menos el descuento
    const impuesto = (subtotal - descuentoMonto) * 0.18;
    this.cotizacion.CotizacionMontoImpuesto = parseFloat(impuesto.toFixed(2));

    // Calcular el total con descuento e impuesto
    this.cotizacion.CotizacionMontoTotal = parseFloat(
      (subtotal - descuentoMonto + impuesto).toFixed(2)
    );

    // Mostrar el monto del descuento como un valor separado
    console.log(`Descuento aplicado: ${descuentoMonto.toFixed(2)}`);
  }

  // Función para recalcular el total cuando se ingrese un descuento
  calcularTotalConDescuento(): void {
    this.calcularTotalCotizacion();
  }
}
