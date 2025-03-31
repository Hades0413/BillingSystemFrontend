import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Producto } from '../shared/producto.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductoService } from './producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-producto',
  templateUrl: './register-producto.component.html',
  styleUrls: ['./register-producto.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class RegisterProductoComponent {
  constructor(
    public dialogRef: MatDialogRef<RegisterProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Producto,
    private productoService: ProductoService 
  ) {}

  // Método para cerrar el diálogo
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Método para guardar el producto
  saveProducto(): void {
    // Llamar al servicio para registrar el producto
    this.productoService.registrarProducto(this.data).subscribe(
      (response) => {
        // Mostrar alerta de éxito con SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Producto Registrado',
          text: 'El producto se ha registrado correctamente.',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          // Cerrar el diálogo con los datos del producto registrado
          this.dialogRef.close(response);
        });
      },
      (error) => {
        // Si ocurre un error, mostrar un mensaje de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al registrar el producto.',
          confirmButtonText: 'Aceptar',
        });
        // Cerrar el diálogo sin realizar ninguna acción adicional
        this.dialogRef.close();
      }
    );
  }
}
