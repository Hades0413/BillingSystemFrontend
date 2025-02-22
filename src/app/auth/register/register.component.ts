import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../../shared/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthService],
})
export class RegisterComponent {
  user: User = {
    UsuarioId: 0,
    UsuarioCorreo: '',
    UsuarioContrasena: '',
    UsuarioTelefono: '',
    UsuarioNombres: '',
    UsuarioApellidos: '',
    UsuarioFechaUltimaActualizacion: new Date(),
  };

  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService.registerUser(this.user).subscribe(
      (response: any) => {
        this.router.navigate(['/login']);
      },
      (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = 'Error al registrar usuario. Intente nuevamente.';
        console.error(error);
      }
    );
  }
}
