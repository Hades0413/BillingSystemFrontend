import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['registerUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        FormsModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should register user successfully', () => {
    const userMock = {
      UsuarioId: 1,
      UsuarioCorreo: 'user@example.com',
      UsuarioContrasena: 'password123',
      UsuarioTelefono: '1234567890',
      UsuarioNombres: 'John',
      UsuarioApellidos: 'Doe',
      UsuarioFechaUltimaActualizacion: new Date(),
    };

    mockAuthService.registerUser.and.returnValue(of({}));

    component.user = userMock;
    component.register();

    expect(component.isSubmitting).toBeTrue();
    expect(mockAuthService.registerUser).toHaveBeenCalledWith(userMock);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle error when registering user', () => {
    const userMock = {
      UsuarioId: 1,
      UsuarioCorreo: 'user@example.com',
      UsuarioContrasena: 'password123',
      UsuarioTelefono: '1234567890',
      UsuarioNombres: 'John',
      UsuarioApellidos: 'Doe',
      UsuarioFechaUltimaActualizacion: new Date(),
    };

    mockAuthService.registerUser.and.returnValue(
      throwError(() => new Error('Error al registrar usuario'))
    );

    component.user = userMock;
    component.register();

    expect(component.isSubmitting).toBeFalse();
    expect(component.errorMessage).toBe(
      'Error al registrar usuario. Intente nuevamente.'
    );
    expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('should set isSubmitting to true during registration', () => {
    const userMock = {
      UsuarioId: 1,
      UsuarioCorreo: 'user@example.com',
      UsuarioContrasena: 'password123',
      UsuarioTelefono: '1234567890',
      UsuarioNombres: 'John',
      UsuarioApellidos: 'Doe',
      UsuarioFechaUltimaActualizacion: new Date(),
    };

    mockAuthService.registerUser.and.returnValue(of({}));

    component.user = userMock;
    component.register();

    expect(component.isSubmitting).toBeTrue();
  });

  it('should set isSubmitting to false if registration fails', () => {
    const userMock = {
      UsuarioId: 1,
      UsuarioCorreo: 'user@example.com',
      UsuarioContrasena: 'password123',
      UsuarioTelefono: '1234567890',
      UsuarioNombres: 'John',
      UsuarioApellidos: 'Doe',
      UsuarioFechaUltimaActualizacion: new Date(),
    };

    mockAuthService.registerUser.and.returnValue(
      throwError(() => new Error('Error al registrar usuario'))
    );

    component.user = userMock;
    component.register();

    expect(component.isSubmitting).toBeFalse();
  });

  it('should call the register function on form submit', () => {
    spyOn(component, 'register');
    const form = fixture.nativeElement.querySelector('form');
    form.submit();
    expect(component.register).toHaveBeenCalled();
  });
});
