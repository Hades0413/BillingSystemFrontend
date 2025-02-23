import { Component, OnInit } from '@angular/core';
import { ProductoService } from './producto.service';
import { Producto } from '../shared/producto.model';
import { AuthService } from '../auth/auth.service';
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
import { PageEvent } from '@angular/material/paginator';
import { Categoria } from '../shared/categoria.model';
import { CategoriaService } from '../categoria/categoria.service';
import { Unidad } from '../shared/unidad.model';
import { UnidadService } from '../unidad/unidad.service';
import { EditarProductoComponent } from './editar-producto.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
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
  ],
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  unidades: Unidad[] = [];
  productoParaEditar: Producto | null = null;
  paginatedProductos: Producto[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  selectedProductos: { [key: number]: boolean } = {};
  isLoading = true;
  errorMessage: string | null = null;

  searchTerm: string = '';

  // Filtros individuales
  filterCodigo: string = '';
  filterNombre: string = '';
  filterStock: string = '';
  filterPrecio: string = '';
  filterIgv: string = '';
  filterCategoria: string = '';
  filterImagen: string = '';
  filterUnidad: string = '';
  activeFilter: string | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  sortDirection: string = 'asc';
  sortColumn:
    | 'ProductoId'
    | 'ProductoCodigo'
    | 'ProductoNombre'
    | 'ProductoStock'
    | 'ProductoPrecioVenta'
    | 'ProductoImpuestoIgv'
    | 'UnidadId'
    | 'CategoriaId'
    | 'UsuarioId'
    | 'ProductoImagen'
    | 'ProductoFechaUltimaActualizacion' = 'ProductoId';
  selectAll: boolean = false;

  public categoriaMap: { [key: number]: string } = {};
  public unidadMap: { [key: number]: string } = {};

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private unidadeService: UnidadService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.loadCategorias();
    this.loadUnidades();
  }

  loadUnidades(): void {
    this.unidadeService.getUnidades().subscribe(
      (response: any) => {
        if (response && response.unidades) {
          this.unidades = response.unidades.map((unidad: any) => ({
            UnidadId: unidad.unidadId,
            UnidadNombre: unidad.unidadNombre,
          }));
          this.unidadMap = this.unidades.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.UnidadId]: curr.UnidadNombre,
            }),
            {}
          );
        } else {
          this.errorMessage = 'No se encontraron unidades.';
        }
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error al cargar las unidades.';
        this.isLoading = false;
      }
    );
  }

  loadCategorias(): void {
    this.categoriaService.getCategoriasPorUsuario().subscribe(
      (response: any) => {
        if (response && response.data) {
          this.categorias = response.data.map((categoria: any) => ({
            CategoriaId: categoria.categoriaId,
            CategoriaNombre: categoria.categoriaNombre,
            UsuarioId: categoria.usuarioId,
          }));
          this.categoriaMap = this.categorias.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.CategoriaId]: curr.CategoriaNombre,
            }),
            {}
          );
        } else {
          this.errorMessage = 'No se encontraron categorías.';
        }
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error al cargar las categorías.';
        this.isLoading = false;
      }
    );
  }

  cargarProductos(): void {
    const usuarioId = parseInt(localStorage.getItem('UsuarioId')!, 10);

    if (usuarioId) {
      this.productoService.getProductosPorUsuario(usuarioId).subscribe(
        (response) => {
          this.productos = response.data.map((producto: any) => ({
            ProductoId: producto.productoId,
            ProductoCodigo: producto.productoCodigo,
            ProductoNombre: producto.productoNombre,
            ProductoStock: producto.productoStock,
            ProductoPrecioVenta: producto.productoPrecioVenta,
            ProductoImpuestoIgv: producto.productoImpuestoIgv,
            UnidadId: producto.unidadId,
            CategoriaId: producto.categoriaId,
            UsuarioId: producto.usuarioId,
            ProductoImagen: producto.productoImagen,
            ProductoFechaUltimaActualizacion:
              producto.productoFechaUltimaActualizacion,
          }));

          this.isLoading = false;
          this.paginateProducts();
        },
        (error) => {
          this.errorMessage = 'Error al cargar los productos.';
          this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = 'Usuario no autenticado.';
      this.isLoading = false;
    }
  }

  paginateProducts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;

    this.paginatedProductos = this.productos
      .filter((producto) => {
        const categoriaNombre =
          this.categoriaMap[producto.CategoriaId] || 'Categoría no encontrada';
        const unidadNombre =
          this.unidadMap[producto.UnidadId] || 'Unidad no encontrada';

        return (
          (!this.filterCodigo ||
            producto.ProductoCodigo.toLowerCase().includes(
              this.filterCodigo.toLowerCase()
            )) &&
          (!this.filterNombre ||
            producto.ProductoNombre.toLowerCase().includes(
              this.filterNombre.toLowerCase()
            )) &&
          (!this.filterStock ||
            producto.ProductoStock.toString().includes(this.filterStock)) &&
          (!this.filterPrecio ||
            producto.ProductoPrecioVenta.toString().includes(
              this.filterPrecio
            )) &&
          (!this.filterIgv ||
            producto.ProductoImpuestoIgv.toString().includes(this.filterIgv)) &&
          (!this.filterCategoria ||
            categoriaNombre
              .toLowerCase()
              .includes(this.filterCategoria.toLowerCase())) &&
          (!this.filterImagen ||
            (producto.ProductoImagen || '')
              .toLowerCase()
              .includes(this.filterImagen.toLowerCase())) &&
          (!this.filterUnidad ||
            unidadNombre
              .toLowerCase()
              .includes(this.filterUnidad.toLowerCase()))
        );
      })
      .sort((a, b) => {
        if (this.sortDirection === 'asc') {
          return a[this.sortColumn] > b[this.sortColumn] ? 1 : -1;
        } else {
          return a[this.sortColumn] < b[this.sortColumn] ? 1 : -1;
        }
      });

    this.totalItems = this.paginatedProductos.length;
    this.paginatedProductos = this.paginatedProductos.slice(
      startIndex,
      endIndex
    );
  }

  paginateProductsearchTern(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = this.currentPage * this.itemsPerPage;

    this.paginatedProductos = this.productos
      .filter((producto) => {
        const categoriaNombre =
          this.categoriaMap[producto.CategoriaId] || 'Categoría no encontrada';
        const unidadNombre =
          this.unidadMap[producto.UnidadId] || 'Unidad no encontrada';

        return (
          (producto.ProductoNombre.toLowerCase().includes(
            this.searchTerm.toLowerCase()
          ) ||
            producto.ProductoCodigo.toLowerCase().includes(
              this.searchTerm.toLowerCase()
            ) ||
            producto.ProductoStock.toString().includes(this.searchTerm) ||
            producto.ProductoPrecioVenta.toString().includes(this.searchTerm) ||
            producto.ProductoImpuestoIgv.toString().includes(this.searchTerm) ||
            categoriaNombre
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase()) ||
            unidadNombre
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase())) &&
          (!this.filterIgv ||
            producto.ProductoImpuestoIgv.toString().includes(this.filterIgv)) &&
          (!this.filterCategoria ||
            categoriaNombre
              .toLowerCase()
              .includes(this.filterCategoria.toLowerCase())) &&
          (!this.filterImagen ||
            (producto.ProductoImagen || '')
              .toLowerCase()
              .includes(this.filterImagen.toLowerCase())) &&
          (!this.filterUnidad ||
            unidadNombre
              .toLowerCase()
              .includes(this.filterUnidad.toLowerCase()))
        );
      })
      .sort((a, b) => {
        if (this.sortDirection === 'asc') {
          return a[this.sortColumn] > b[this.sortColumn] ? 1 : -1;
        } else {
          return a[this.sortColumn] < b[this.sortColumn] ? 1 : -1;
        }
      })
      .slice(startIndex, endIndex);
  }

  changePage(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.itemsPerPage = event.pageSize;
    this.paginateProducts();
  }

  sortData(
    column:
      | 'ProductoId'
      | 'ProductoCodigo'
      | 'ProductoNombre'
      | 'ProductoStock'
      | 'ProductoPrecioVenta'
      | 'ProductoImpuestoIgv'
      | 'UnidadId'
      | 'CategoriaId'
      | 'UsuarioId'
      | 'ProductoImagen'
  ): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.paginateProducts();
  }

  editarProducto(producto: Producto): void {
    const dialogRef = this.dialog.open(EditarProductoComponent, {
      width: '500px',
      data: producto,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Producto editado:', result);
      }
    });
  }

  toggleFilter(filterName: string): void {
    this.activeFilter = this.activeFilter === filterName ? null : filterName;
  }
}
