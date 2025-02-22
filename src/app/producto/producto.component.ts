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
  paginatedProductos: Producto[] = [];
  totalItems: number = 0;
  pageSize: number = 10;
  selectedProductos: { [key: number]: boolean } = {};
  isLoading = true;
  errorMessage: string | null = null;
  searchTerm: string = '';
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

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private unidadeService: UnidadService,
    private authService: AuthService
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
  
  getUnidadById(unidadId: number) {
    const unidad = this.unidades.find((u) => u.UnidadId === unidadId);
    return unidad;
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

  getCategoriaNombre(categoriaId: number): string {
    const categoria = this.categorias.find(
      (c) => c.CategoriaId === categoriaId
    );
    if (categoria) {
      return categoria.CategoriaNombre;
    } else {
      return 'Categoría no encontrada';
    }
  }

  getCategoriaById(categoriaId: number) {
    return this.categorias.find((c) => c.CategoriaId === categoriaId);
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
      .filter(
        (producto) =>
          producto.ProductoNombre.toLowerCase().includes(
            this.searchTerm.toLowerCase()
          ) ||
          producto.ProductoCodigo.toLowerCase().includes(
            this.searchTerm.toLowerCase()
          ) ||
          producto.ProductoStock.toString().includes(this.searchTerm) ||
          producto.ProductoPrecioVenta.toString().includes(this.searchTerm) ||
          producto.ProductoImpuestoIgv.toString().includes(this.searchTerm)
      )
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

  totalPages(): number {
    const filteredItems = this.productos.filter(
      (producto) =>
        producto.ProductoNombre.toLowerCase().includes(
          this.searchTerm.toLowerCase()
        ) || producto.ProductoId.toString().includes(this.searchTerm)
    );
    return Math.ceil(filteredItems.length / this.itemsPerPage);
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

  toggleAll(): void {
    if (this.selectAll) {
      this.paginatedProductos.forEach(
        (producto) => (this.selectedProductos[producto.ProductoId] = true)
      );
    } else {
      this.paginatedProductos.forEach(
        (producto) => (this.selectedProductos[producto.ProductoId] = false)
      );
    }
  }
}
