import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../../shared/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Si estás usando ngModel

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule], 
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    providers: [AuthService]
  })
  export class RegisterComponent {
    user: User = new User(0, '', '', '', '', '', new Date());
    isSubmitting = false;
    errorMessage: string | null = null;
  
    constructor(private authService: AuthService, private router: Router) {}
  
    register() {
      this.isSubmitting = true;
      this.errorMessage = null;  // Limpiar cualquier mensaje de error previo
  
      // Llamamos al servicio para registrar el usuario
      this.authService.registerUser(this.user).subscribe(
        (response: any) => {  // Puedes especificar un tipo adecuado aquí
          // Si el registro es exitoso, redirigimos a la página de login
          this.router.navigate(['/login']);
        },
        (error: any) => {  // También puedes especificar un tipo adecuado aquí
          // Si hay un error, mostramos el mensaje de error
          this.isSubmitting = false;
          this.errorMessage = 'Error al registrar usuario. Intente nuevamente.';
          console.error(error);
        }
      );
    }
  }
  
