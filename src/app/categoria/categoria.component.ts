import { Component, OnInit } from '@angular/core';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../shared/categoria.model';
import { AuthService } from '../auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
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
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  dataSource = new MatTableDataSource<Categoria>();
  isLoading = true;
  errorMessage: string | null = null;
  displayedColumns: string[] = ['Orden', 'CategoriaNombre', 'Acciones'];

  searchTerm: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getCategoriasPorUsuario().subscribe(
      (response: any) => {
        if (response && response.data) {
          this.categorias = response.data.map((categoria: any) => ({
            CategoriaId: categoria.categoriaId,
            CategoriaNombre: categoria.categoriaNombre,
          }));
          this.dataSource.data = this.categorias;
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

  filterCategorias(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  changePage(event: PageEvent): void {
    console.log(
      'Página cambiada:',
      event.pageIndex,
      'Tamaño de página:',
      event.pageSize
    );
  }

  editCategoria(categoria: Categoria): void {
    Swal.fire({
      title: 'Editar categoría',
      input: 'text',
      inputValue: categoria.CategoriaNombre,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: (nuevoNombre) => {
        if (!nuevoNombre) {
          Swal.showValidationMessage('El nombre no puede estar vacío');
        }
        return nuevoNombre;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        categoria.CategoriaNombre = result.value;
        Swal.fire('Guardado', 'La categoría ha sido actualizada', 'success');
      }
    });
  }

  deleteCategoria(categoria: Categoria): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Eliminarás la categoría: ${categoria.CategoriaNombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado', 'La categoría ha sido eliminada', 'success');
      }
    });
  }
}
