import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-venta-detalle',
  templateUrl: './venta-detalle.component.html',
  styleUrls: ['./venta-detalle.component.css'],
    standalone: true,
    imports: [
      CommonModule,
      MatTableModule,
      MatSortModule,
      MatPaginatorModule,
      MatCheckboxModule,
      MatProgressBarModule,
      MatCardModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      FormsModule,
      MatDialogModule,
      MatListModule,
    ],
})
export class VentaDetalleComponent{
    
  
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
/*
  ngOnInit(): void {
    // Si el ID de la venta está pasando por el input, se carga directamente.
    if (this.ventaId) {
      this.cargarVentaDetalle(this.ventaId);
    } else {
      // Si no, intentamos leer el ID de la URL.
      this.route.paramMap.subscribe((params) => {
        const id = parseInt(params.get('id') ?? '0', 10);
        if (id) {
          this.cargarVentaDetalle(id);
        } else {
          this.errorMessage = 'ID de venta no válido';
        }
      });
    }
  }
/*
  cargarVentaDetalle(id: number): void {
    this.isLoading = true;
    this.ventaService.getVentaById(id).subscribe(
      (venta) => {
        this.venta = venta;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Error al cargar los detalles de la venta';
        this.isLoading = false;
      }
    );
  }*/

}
