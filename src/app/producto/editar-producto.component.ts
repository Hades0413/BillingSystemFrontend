import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Producto } from '../shared/producto.model';
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
    MatDialogModule, 
  ],
})
export class EditarProductoComponent {
  constructor(
    public dialogRef: MatDialogRef<EditarProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto 
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveProducto(): void {
    console.log('Producto editado:', this.data);
    this.dialogRef.close(this.data);
  }
}
