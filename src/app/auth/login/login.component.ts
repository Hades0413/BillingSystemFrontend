import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Componente para la pantalla de inicio de sesión (login).
 *
 * Este componente permite a los usuarios ingresar su correo electrónico y contraseña
 * para acceder a la aplicación. También incluye la opción de iniciar sesión mediante
 * GitHub y mostrar u ocultar la contraseña ingresada.
 */
@Component({
  selector: 'app-login', // Nombre del selector del componente, usado en el HTML.
  standalone: true, // Indica que este componente es autónomo (sin necesidad de ser declarado en un módulo).
  imports: [
    CommonModule, // Módulo para usar directivas comunes de Angular, como ngIf y ngFor.
    FormsModule, // Módulo para habilitar formularios basados en plantilla.
    RouterModule, // Módulo para navegación y enrutamiento de rutas.
    MatFormFieldModule, // Módulo de Angular Material para campos de formulario.
    MatInputModule, // Módulo de Angular Material para el control de entradas de texto.
    MatButtonModule, // Módulo de Angular Material para botones.
    MatIconModule, // Módulo de Angular Material para iconos.
  ],
  templateUrl: './login.component.html', // Ruta del archivo HTML asociado al componente.
  styleUrls: ['./login.component.css'], // Ruta del archivo de estilo CSS asociado al componente.
})
export class LoginComponent {
  // Propiedades vinculadas al formulario de inicio de sesión.
  usuarioCorreo: string = ''; // Almacena el correo electrónico ingresado por el usuario.
  usuarioContrasena: string = ''; // Almacena la contraseña ingresada por el usuario.
  isSubmitting: boolean = false; // Indicador para saber si se está enviando la solicitud de inicio de sesión.
  errorMessage: string | null = null; // Mensaje de error que se muestra si el inicio de sesión falla.
  hidePassword: boolean = true; // Determina si la contraseña debe ser visible u oculta.

  /**
   * Constructor del componente.
   *
   * @param authService El servicio de autenticación utilizado para manejar el login.
   * @param router El servicio de enrutamiento de Angular para redirigir al usuario después de un login exitoso.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Función para manejar el inicio de sesión utilizando correo y contraseña.
   *
   * Envia la solicitud de inicio de sesión al servicio `AuthService`, y en caso de
   * éxito redirige al usuario al dashboard. Si falla, se muestra un mensaje de error.
   */
  login() {
    // Marcar como enviando la solicitud
    this.isSubmitting = true;
    this.errorMessage = null; // Restablecer el mensaje de error previo.

    // Llamada al servicio de autenticación para validar las credenciales del usuario.
    this.authService
      .login(this.usuarioCorreo, this.usuarioContrasena)
      .subscribe(
        (response) => {
          // Si el inicio de sesión es exitoso, redirigir al usuario al dashboard.
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          // Si ocurre un error, actualizar la UI para reflejarlo.
          this.isSubmitting = false; // Indicar que el proceso ha finalizado.
          this.errorMessage =
            'Correo o contraseña incorrectos. Intente nuevamente.'; // Mensaje de error visible para el usuario.
          console.error(error); // Registrar el error en la consola para diagnóstico.
        }
      );
  }

  /**
   * Función para iniciar sesión con GitHub.
   *
   * Inicia el proceso de autenticación usando la cuenta de GitHub del usuario.
   */
  loginWithGitHub() {
    // Marcar como enviando la solicitud
    this.isSubmitting = true;

    // Llamada al servicio de autenticación para manejar el login con GitHub.
    this.authService.loginWithGitHub();
  }

  /**
   * Alterna la visibilidad de la contraseña ingresada.
   *
   * Esta función permite a los usuarios ver u ocultar la contraseña al hacer clic en el icono
   * de ojo en el campo de entrada de la contraseña.
   */
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword; // Cambiar el estado de visibilidad de la contraseña.
  }
}
