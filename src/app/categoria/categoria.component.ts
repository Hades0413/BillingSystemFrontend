import { Component, OnInit } from '@angular/core';
import { CategoriaService } from './categoria.service';
import { Categoria } from '../shared/categoria.model';
import { AuthService } from '../auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  displayedColumns: string[] = ['CategoriaId', 'CategoriaNombre']; 

  constructor(
    private categoriaService: CategoriaService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriaService.getCategoriasPorUsuario().subscribe(
      (response) => {
        this.categorias = response;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error al cargar las categorías.';
        this.isLoading = false;
      }
    );
  }
}
