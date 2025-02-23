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

@Component({
  selector: 'app-register-categoria',
  templateUrl: './register-categoria.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterCategoriaComponent implements OnInit {
  categoriaForm: any;

  mensaje: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.categoriaForm = this.fb.group({
      categoriaNombre: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  registerCategoria(): void {
    if (this.categoriaForm.valid) {
      const categoria: Categoria = {
        CategoriaId: 0,
        CategoriaNombre: this.categoriaForm.value.categoriaNombre!,
        UsuarioId: parseInt(localStorage.getItem('UsuarioId')!, 10),
        CategoriaInformacionAdicional: new Date(),
      };

      this.categoriaService.registerCategoriasPorUsuario(categoria).subscribe(
        (response) => {
          this.mensaje = 'Categoría registrada exitosamente';
        },
        (error) => {
          this.mensaje = 'Error al registrar categoría';
        }
      );
    } else {
      this.mensaje = 'Formulario no válido';
    }
  }

  onSubmit(): void {
    this.registerCategoria();
  }
}
