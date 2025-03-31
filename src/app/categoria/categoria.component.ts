import { Component, OnInit } from '@angular/core';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../shared/categoria.model';
import { AuthService } from '../auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
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
import { RegisterCategoriaComponent } from './register-categoria.component';

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
    RegisterCategoriaComponent,
  ],
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  dataSource = new MatTableDataSource<Categoria>();
  isLoading = true;
  errorMessage: string | null = null;
  displayedColumns: string[] = ['Orden', 'CategoriaNombre', 'Acciones'];
  activeFilter: string | null = null;
  filterNombre: string = '';
  pageSize: number = 5;
  currentPage: number = 0;
  searchTerm: string = '';

  categoriaForm: any;

  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.categoriaForm = this.fb.group({
      categoriaNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.loadCategorias();
  }

  // Método para filtrar categorías
  filterCategorias(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  toggleFilter(filterName: string): void {
    this.activeFilter = this.activeFilter === filterName ? null : filterName;
  }

  // Método para aplicar filtro por nombre
  applyFilter(): void {
    this.dataSource.data = this.categorias.filter((categoria) => {
      return (
        !this.filterNombre ||
        categoria.CategoriaNombre.toLowerCase().includes(
          this.filterNombre.toLowerCase()
        )
      );
    });
  }

  // Cargar categorías desde el servicio
  loadCategorias(): void {
    this.isLoading = true;

    this.categoriaService.getCategoriasPorUsuario().subscribe(
      (response: any) => {
        if (response?.data) {
          this.categorias = response.data.map((categoria: any) => ({
            CategoriaId: categoria.categoriaId,
            CategoriaNombre: categoria.categoriaNombre,
          }));
          this.dataSource.data = this.categorias;
          this.applyFilter();
        } else {
          this.errorMessage = 'No se encontraron categorías.';
        }
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = error.message || 'Error al cargar las categorías.';
        this.isLoading = false;
      }
    );
  }

  // Cambiar página en la tabla
  changePage(event: PageEvent): void {
    console.log(
      'Página cambiada:',
      event.pageIndex,
      'Tamaño de página:',
      event.pageSize
    );
  }

  // Editar una categoría
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

        this.categoriaService
          .editarCategoria(categoria.CategoriaId, categoria)
          .subscribe(
            (response) => {
              Swal.fire(
                'Guardado',
                'La categoría ha sido actualizada',
                'success'
              );
              this.loadCategorias();
            },
            (error) => {
              Swal.fire(
                'Error',
                'Hubo un problema al actualizar la categoría',
                'error'
              );
            }
          );
      }
    });
  }

  // Eliminar una categoría
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
        this.categoriaService
          .eliminarCategoria(categoria.CategoriaId)
          .subscribe(
            (response) => {
              Swal.fire(
                'Eliminado',
                'La categoría ha sido eliminada',
                'success'
              );
              this.loadCategorias();
            },
            (error) => {
              Swal.fire(
                'Error',
                'Hubo un problema al eliminar la categoría',
                'error'
              );
            }
          );
      }
    });
  }

  // Mostrar el formulario para registrar una nueva categoría
  showRegisterCategoria: boolean = false;

  openRegisterCategoria(): void {
    Swal.fire({
      title: 'Crear nueva categoría',
      input: 'text',
      inputPlaceholder: 'Ingresa el nombre de la categoría',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: (categoriaNombre) => {
        if (!categoriaNombre || categoriaNombre.trim().length < 3) {
          Swal.showValidationMessage(
            'El nombre debe tener al menos 3 caracteres.'
          );
          return;
        }

        const categoria: Categoria = {
          CategoriaId: 0,
          CategoriaNombre: categoriaNombre!,
          UsuarioId: parseInt(localStorage.getItem('UsuarioId')!, 10),
          CategoriaInformacionAdicional: new Date(),
        };

        return this.categoriaService
          .registerCategoriasPorUsuario(categoria)
          .toPromise()
          .then(
            (response) => {
              Swal.fire('Categoría registrada', '', 'success');
              this.loadCategorias();
            },
            (error) => {
              Swal.fire(
                'Error',
                'Hubo un problema al registrar la categoría',
                'error'
              );
            }
          );
      },
    });
  }

  // Cerrar el formulario de registrar categoría
  closeRegisterCategoria(): void {
    this.showRegisterCategoria = false;
  }
}
