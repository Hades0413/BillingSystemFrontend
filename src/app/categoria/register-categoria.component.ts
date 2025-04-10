import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../shared/categoria.model';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';

/**
 * Componente para registrar una nueva categoría.
 *
 * Este componente permite a los usuarios crear nuevas categorías mediante un formulario reactivo,
 * validando que los datos sean correctos antes de enviarlos al servidor para su registro.
 * El formulario requiere que el nombre de la categoría tenga al menos 3 caracteres y se valida
 * si es un campo obligatorio.
 */
@Component({
  selector: 'app-register-categoria', // Nombre del selector del componente.
  templateUrl: './register-categoria.component.html', // Ruta del archivo HTML asociado al componente.
  standalone: true, // Indica que este componente es autónomo (sin necesidad de ser declarado en un módulo).
  imports: [
    CommonModule, // Módulo de directivas comunes de Angular.
    FormsModule, // Módulo que habilita formularios basados en plantilla.
    ReactiveFormsModule, // Módulo que permite usar formularios reactivos.
    MatFormFieldModule, // Módulo de Angular Material para campos de formulario.
    MatInputModule, // Módulo de Angular Material para campos de entrada de texto.
    MatButtonModule, // Módulo de Angular Material para botones.
    MatCardModule, // Módulo de Angular Material para tarjetas.
    MatChipsModule, // Módulo de Angular Material para chips (etiquetas interactivas).
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Permite el uso de elementos personalizados no registrados previamente.
})
export class RegisterCategoriaComponent implements OnInit {
  // Propiedad para almacenar el formulario reactivo.
  categoriaForm: any;

  // Propiedad para almacenar mensajes de éxito o error relacionados con el registro.
  mensaje: string = '';

  /**
   * Constructor del componente.
   *
   * @param categoriaService Servicio que maneja la lógica de interacción con el backend para las categorías.
   * @param fb Instancia de `FormBuilder` para la creación de formularios reactivos.
   */
  constructor(
    private categoriaService: CategoriaService, // Servicio para manejar operaciones de categoría.
    private fb: FormBuilder // Utilizado para crear formularios reactivos.
  ) {}

  /**
   * Método del ciclo de vida de Angular, se ejecuta al inicializar el componente.
   *
   * Configura el formulario reactivo con sus validaciones, en este caso el nombre de la categoría es obligatorio
   * y debe tener una longitud mínima de 3 caracteres.
   */
  ngOnInit(): void {
    // Inicializa el formulario reactivo con los campos y validaciones correspondientes.
    this.categoriaForm = this.fb.group({
      categoriaNombre: [
        '', // Valor inicial vacío.
        [Validators.required, Validators.minLength(3)], // Validaciones: obligatorio y longitud mínima de 3 caracteres.
      ],
    });
  }

  /**
   * Método para registrar una nueva categoría en el sistema.
   *
   * Valida que el formulario sea correcto antes de enviar la solicitud de registro al servicio `CategoriaService`.
   * En caso de éxito, muestra un mensaje de confirmación. Si hay un error, muestra un mensaje de error.
   */
  registerCategoria(): void {
    // Verificar que el formulario es válido antes de proceder.
    if (this.categoriaForm.valid) {
      // Crear un objeto de tipo `Categoria` con los valores del formulario.
      const categoria: Categoria = {
        CategoriaId: 0, // Se asigna un valor de ID predeterminado ya que es un nuevo registro.
        CategoriaNombre: this.categoriaForm.value.categoriaNombre!, // Se toma el nombre de la categoría desde el formulario.
        UsuarioId: parseInt(localStorage.getItem('UsuarioId')!, 10), // Se obtiene el ID del usuario desde el almacenamiento local.
        CategoriaInformacionAdicional: new Date(), // Se asigna la fecha actual como información adicional.
      };

      // Llamada al servicio para registrar la categoría en el servidor.
      this.categoriaService.registerCategoriasPorUsuario(categoria).subscribe(
        (response) => {
          // Si el registro es exitoso, mostrar mensaje de éxito.
          this.mensaje = 'Categoría registrada exitosamente';
        },
        (error) => {
          // Si ocurre un error durante el registro, mostrar mensaje de error.
          this.mensaje = 'Error al registrar categoría';
        }
      );
    } else {
      // Si el formulario no es válido, mostrar mensaje indicando el problema.
      this.mensaje = 'Formulario no válido';
    }
  }

  /**
   * Método llamado al enviar el formulario.
   *
   * Este método invoca `registerCategoria()` para intentar registrar la nueva categoría.
   */
  onSubmit(): void {
    this.registerCategoria();
  }
}
