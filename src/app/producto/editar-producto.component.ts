import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Producto } from '../shared/producto.model';
import { ProductoService } from '../producto/producto.service'; // Importar el servicio
import { FormsModule } from '@angular/forms';
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
import Swal from 'sweetalert2'; // Para mostrar alertas
import { Unidad } from '../shared/unidad.model';
import { Categoria } from '../shared/categoria.model';
import { UnidadService } from '../unidad/unidad.service';
import { CategoriaService } from '../categoria/categoria.service';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
],
})
export class EditarProductoComponent implements OnInit {
  unidades: Unidad[] = []; // Aquí cargaremos las unidades
  categorias: Categoria[] = []; // Aquí cargaremos las categorías

  constructor(
    public dialogRef: MatDialogRef<EditarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private productoService: ProductoService,
    private unidadService: UnidadService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    // Aquí cargamos las unidades y categorías
    this.loadUnidades();
    this.loadCategorias();
  }

  loadUnidades(): void {
    this.unidadService.getUnidades().subscribe((response: any) => {
      if (response && response.unidades) {
        this.unidades = response.unidades.map((unidad: any) => ({
          UnidadId: unidad.unidadId,
          UnidadCodigo: unidad.unidadCodigo, // Agrega el código de unidad
          UnidadNombre: unidad.unidadNombre,
        }));
      }
    });
  }

  loadCategorias(): void {
    this.categoriaService
      .getCategoriasPorUsuario()
      .subscribe((response: any) => {
        if (response && response.data) {
          this.categorias = response.data.map((categoria: any) => ({
            CategoriaId: categoria.categoriaId,
            CategoriaCodigo: categoria.categoriaCodigo, // Agrega el código de categoría
            CategoriaNombre: categoria.categoriaNombre,
          }));
        }
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveProducto(): void {
    if (this.isValidProducto(this.data)) {
      this.productoService
        .editarProducto(this.data.ProductoId, this.data)
        .subscribe(
          (response) => {
            Swal.fire('Éxito', 'Producto editado correctamente', 'success');
            this.dialogRef.close(this.data);
          },
          (error) => {
            Swal.fire(
              'Error',
              'Hubo un problema al editar el producto',
              'error'
            );
          }
        );
    } else {
      Swal.fire(
        'Advertencia',
        'Por favor complete todos los campos correctamente',
        'warning'
      );
    }
  }

  isValidProducto(producto: Producto): boolean {
    return (
      producto.ProductoNombre.trim() !== '' &&
      producto.ProductoCodigo.trim() !== '' &&
      producto.ProductoStock >= 0 &&
      producto.ProductoPrecioVenta > 0 &&
      producto.UnidadId > 0 &&
      producto.CategoriaId > 0
    );
  }
}
