import { Component } from '@angular/core';
import { ProductoComponent } from '../../producto/producto.component';
import { CategoriaComponent } from '../../categoria/categoria.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  imports: [
    ProductoComponent,
    CategoriaComponent,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
  ],
})
export class DashboardPrducto {
  selectedTab: string = 'producto'; // Por defecto, mostramos el componente Producto

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
