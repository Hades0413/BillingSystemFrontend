import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usuarioCorreo: string = '';
  usuarioContrasena: string = '';
  isSubmitting = false;
  errorMessage: string | null = null;
  hidePassword: boolean = true; // Para controlar la visibilidad de la contraseña

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService
      .login(this.usuarioCorreo, this.usuarioContrasena)
      .subscribe(
        (response) => {
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.isSubmitting = false;
          this.errorMessage =
            'Correo o contraseña incorrectos. Intente nuevamente.';
          console.error(error);
        }
      );
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
