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

/**
 * Componente encargado de la gestión de categorías en la aplicación.
 *
 * Permite listar, registrar, editar y eliminar categorías. Además, proporciona
 * funcionalidades de filtrado y paginación para la visualización de las categorías.
 */
@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  standalone: true, // Indica que este componente es independiente.
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
    RegisterCategoriaComponent, // Componente para registrar categorías.
  ],
})
export class CategoriaComponent implements OnInit {
  // Lista de categorías obtenidas desde el servicio.
  categorias: Categoria[] = [];
  // Fuente de datos para la tabla de categorías, usada con MatTable.
  dataSource = new MatTableDataSource<Categoria>();
  // Indicador de carga.
  isLoading = true;
  // Mensaje de error en caso de fallo.
  errorMessage: string | null = null;
  // Columnas a mostrar en la tabla.
  displayedColumns: string[] = ['Orden', 'CategoriaNombre', 'Acciones'];
  // Filtro activo.
  activeFilter: string | null = null;
  // Filtro por nombre de categoría.
  filterNombre: string = '';
  // Tamaño de página para la paginación.
  pageSize: number = 5;
  // Página actual para la paginación.
  currentPage: number = 0;
  // Término de búsqueda para el filtro.
  searchTerm: string = '';

  // Formulario reactivo para crear o editar categorías.
  categoriaForm: any;

  /**
   * Constructor del componente de categorías.
   *
   * @param categoriaService Servicio para interactuar con la API de categorías.
   * @param authService Servicio para la autenticación del usuario.
   * @param fb FormBuilder para crear formularios reactivos.
   */
  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.categoriaForm = this.fb.group({
      categoriaNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  /**
   * Método de inicialización del componente. Se ejecuta cuando el componente es cargado.
   * Aquí se llaman a los métodos necesarios para cargar las categorías.
   */
  ngOnInit(): void {
    this.loadCategorias();
  }

  /**
   * Método para filtrar las categorías en la tabla.
   *
   * Filtra las categorías basadas en el término de búsqueda.
   */
  filterCategorias(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  /**
   * Cambia el filtro activo. Si ya está activo, se desactiva.
   *
   * @param filterName Nombre del filtro a activar o desactivar.
   */
  toggleFilter(filterName: string): void {
    this.activeFilter = this.activeFilter === filterName ? null : filterName;
  }

  /**
   * Aplica un filtro adicional por nombre de categoría.
   */
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

  /**
   * Carga las categorías desde el servicio.
   *
   * Realiza una llamada al servicio `CategoriaService` para obtener las categorías asociadas
   * al usuario autenticado. Si la carga es exitosa, las categorías se asignan a `this.categorias`.
   * Si hay algún error, se muestra un mensaje de error.
   */
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

  /**
   * Método que se ejecuta cuando se cambia de página en la tabla de categorías.
   *
   * @param event Evento que contiene los detalles de la nueva página seleccionada.
   */
  changePage(event: PageEvent): void {
    console.log(
      'Página cambiada:',
      event.pageIndex,
      'Tamaño de página:',
      event.pageSize
    );
  }

  /**
   * Permite editar una categoría existente.
   *
   * Abre un cuadro de diálogo con `SweetAlert2` para que el usuario ingrese un nuevo nombre para la categoría.
   * Si el usuario confirma, se realiza una solicitud al servicio para actualizar la categoría.
   *
   * @param categoria La categoría que se desea editar.
   */
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

  /**
   * Permite eliminar una categoría.
   *
   * Abre un cuadro de diálogo con `SweetAlert2` preguntando al usuario si está seguro de eliminar la categoría.
   * Si el usuario confirma, se realiza una solicitud al servicio para eliminar la categoría.
   *
   * @param categoria La categoría que se desea eliminar.
   */
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

  /**
   * Abre el formulario para registrar una nueva categoría.
   *
   * Utiliza `SweetAlert2` para pedir al usuario el nombre de la nueva categoría.
   * Si el nombre es válido, se registra la categoría llamando al servicio correspondiente.
   */
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

  /**
   * Cierra el formulario de registro de categoría.
   */
  closeRegisterCategoria(): void {
    this.showRegisterCategoria = false;
  }
}
