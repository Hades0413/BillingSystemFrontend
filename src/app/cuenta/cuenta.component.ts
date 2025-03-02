import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CuentaService } from './cuenta.service';
import { User } from '../shared/user.model';
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
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.css'],
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
    MatFormFieldModule,
    MatSelectModule,
    MatGridListModule,
    MatMenuModule,
    MatListModule,
  ],
})
export class CuentaComponent implements OnInit {
  usuarioId: number | null = null;
  user: any = {
    usuarioId: 0,
    usuarioCorreo: '',
    usuarioContrasena: '',
    usuarioTelefono: '',
    usuarioNombres: '',
    usuarioApellidos: '',
    usuarioFechaUltimaActualizacion: new Date(),
  };
  errorMessage: string = '';

  constructor(
    private cuentaService: CuentaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuarioId = +localStorage.getItem('UsuarioId')!;

    if (this.usuarioId) {
      this.cuentaService.getUsuarioId(this.usuarioId).subscribe(
        (response) => {
          this.user = response.data; 
        },
        (error) => {
          this.errorMessage = 'Error al cargar los detalles del usuario.';
        }
      );
    }
  }

  saveChanges(): void {
    if (this.usuarioId) {
      this.cuentaService.updateUser(this.usuarioId, this.user).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Usuario actualizado exitosamente.',
          });
        },
        (error) => {
          this.errorMessage = 'Error al actualizar el usuario.';
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: this.errorMessage,
          });
        }
      );
    }
  }
}
