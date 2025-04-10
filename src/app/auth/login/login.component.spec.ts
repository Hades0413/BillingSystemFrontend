import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Creación de mocks para los servicios.
    authService = jasmine.createSpyObj('AuthService', ['login']); // Mock del servicio AuthService.
    router = jasmine.createSpyObj('Router', ['navigate']); // Mock del servicio Router.

    // Configuración del TestBed, eliminando RouterTestingModule obsoleto.
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        FormsModule, // Para el uso de ngModel en formularios.
        MatFormFieldModule, // Para los formularios con material.
        MatInputModule, // Para el campo de entrada (input) con Material Design.
        MatButtonModule, // Para los botones de Material Design.
        MatIconModule, // Para los íconos de Material Design.
        RouterModule.forRoot([]), // Usamos RouterModule directamente en lugar de RouterTestingModule.
      ],
      providers: [
        { provide: AuthService, useValue: authService }, // Proveedor para el servicio AuthService.
        { provide: Router, useValue: router }, // Proveedor para el servicio Router.
        provideRouter([
          // Configuración de rutas para las pruebas.
          { path: 'dashboard', component: LoginComponent }, // Definición de una ruta para pruebas.
        ]),
      ],
    }).compileComponents(); // Compila los componentes antes de las pruebas.
  });

  beforeEach(() => {
    // Inicialización del componente antes de cada prueba.
    fixture = TestBed.createComponent(LoginComponent); // Crea el componente de prueba.
    component = fixture.componentInstance; // Obtiene la instancia del componente.
    fixture.detectChanges(); // Detecta y aplica cambios en la vista del componente.
  });

  it('should create the component', () => {
    // Test 1: Verifica que el componente se cree correctamente.
    expect(component).toBeTruthy(); // Verifica que el componente se haya creado correctamente.
  });

  it('should call login method and navigate on successful login', () => {
    // Test 2: Verifica que al hacer login, se llame al servicio AuthService y se navegue a /dashboard.
    const mockResponse = { token: 'dummy-token' }; // Simula una respuesta exitosa del login.
    authService.login.and.returnValue(of(mockResponse)); // Configura el mock para devolver la respuesta exitosa.

    // Asigna valores a las propiedades del componente para simular el login.
    component.usuarioCorreo = 'test@example.com';
    component.usuarioContrasena = 'password123';

    // Llama al método de login.
    component.login();

    // Verifica que el método login del servicio AuthService haya sido llamado con los parámetros correctos.
    expect(authService.login).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
    expect(component.isSubmitting).toBeTrue(); // Verifica que el estado de "enviando" sea verdadero mientras se realiza el login.
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']); // Verifica que la navegación haya ocurrido correctamente.
    expect(component.errorMessage).toBeNull(); // Verifica que no haya mensajes de error cuando el login es exitoso.
  });

  it('should display an error message when login fails', () => {
    // Test 3: Verifica que se muestre un mensaje de error cuando el login falla.
    const errorResponse = () => new Error('Invalid credentials'); // Simula un error en la respuesta del login.
    authService.login.and.returnValue(throwError(errorResponse)); // Configura el mock para devolver un error usando throwError.

    // Asigna credenciales incorrectas.
    component.usuarioCorreo = 'test@example.com';
    component.usuarioContrasena = 'wrongpassword';

    // Llama al método de login.
    component.login();

    // Verifica que el servicio AuthService haya sido llamado con las credenciales incorrectas.
    expect(authService.login).toHaveBeenCalledWith(
      'test@example.com',
      'wrongpassword'
    );
    expect(component.isSubmitting).toBeFalse(); // Verifica que el estado de "enviando" sea falso después de un error.
    expect(component.errorMessage).toBe(
      'Correo o contraseña incorrectos. Intente nuevamente.'
    ); // Verifica que el mensaje de error se haya mostrado correctamente.
  });

  it('should toggle password visibility', () => {
    // Test 4: Verifica que se pueda alternar la visibilidad de la contraseña.
    expect(component.hidePassword).toBeTrue(); // Al inicio, la contraseña debe estar oculta.

    component.togglePasswordVisibility(); // Llama al método para alternar la visibilidad.
    expect(component.hidePassword).toBeFalse(); // Después de alternar, la contraseña debe ser visible.

    component.togglePasswordVisibility(); // Alterna nuevamente.
    expect(component.hidePassword).toBeTrue(); // Después de la segunda alternancia, la contraseña debe estar oculta.
  });
});
