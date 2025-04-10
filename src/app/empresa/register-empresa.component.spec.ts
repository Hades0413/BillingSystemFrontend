/**
 * @file Unit test suite for RegisterEmpresaComponent.
 * This test suite verifies the functionality of the registration flow for Empresas (Companies),
 * including interactions with services and user feedback.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterEmpresaComponent } from './register-empresa.component';
import { EmpresaService } from './empresa.service';
import { RubroService } from '../rubro/rubro.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from '@angular/core';

// Angular Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

describe('RegisterEmpresaComponent', () => {
  let component: RegisterEmpresaComponent;
  let fixture: ComponentFixture<RegisterEmpresaComponent>;
  let mockEmpresaService: jasmine.SpyObj<EmpresaService>;
  let mockRubroService: jasmine.SpyObj<RubroService>;
  let mockRouter: jasmine.SpyObj<Router>;

  /**
   * Configura el entorno de pruebas con mocks y dependencias necesarias.
   */
  beforeEach(async () => {
    mockEmpresaService = jasmine.createSpyObj('EmpresaService', ['registerEmpresa']);
    mockRubroService = jasmine.createSpyObj('RubroService', ['getRubros']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RegisterEmpresaComponent],
      imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule,
      ],
      providers: [
        { provide: EmpresaService, useValue: mockEmpresaService },
        { provide: RubroService, useValue: mockRubroService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ChangeDetectorRef,
          useValue: jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  /**
   * Crea una instancia fresca del componente antes de cada prueba.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Verifica que el componente se cree correctamente.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifica que los rubros se carguen correctamente al inicializar el componente.
   */
  it('should load rubros on initialization', () => {
    const rubrosMock = [
      {
        RubroId: 1,
        RubroNombre: 'Rubro A',
        RubroFechaUltimaActualizacion: new Date(),
      },
      {
        RubroId: 2,
        RubroNombre: 'Rubro B',
        RubroFechaUltimaActualizacion: new Date(),
      },
    ];

    mockRubroService.getRubros.and.returnValue(of(rubrosMock));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.rubros).toEqual(rubrosMock);
    expect(mockRubroService.getRubros).toHaveBeenCalled();
  });

  /**
   * Verifica el manejo de errores al cargar los rubros.
   */
  it('should handle error when loading rubros', () => {
    mockRubroService.getRubros.and.returnValue(
      throwError(() => new Error('Error al obtener los rubros'))
    );

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Error al obtener los rubros. Intente nuevamente.');
  });

  /**
   * Verifica que una empresa se registre correctamente y redirige al listado.
   */
  it('should register empresa successfully', () => {
    const empresaMock = {
      UsuarioId: 1,
      EmpresaRuc: '1234567890',
      EmpresaRazonSocial: 'Empresa A',
      EmpresaNombreComercial: 'Comercial A',
      EmpresaAlias: 'Alias A',
      EmpresaDomicilioFiscal: 'Direccion A',
      EmpresaLogo: 'Logo A',
      RubroId: 1,
      EmpresaInformacionAdicional: 'Información A',
    };

    mockEmpresaService.registerEmpresa.and.returnValue(of({}));

    component.empresa = empresaMock;
    component.register();

    expect(component.isSubmitting).toBeTrue();
    expect(mockEmpresaService.registerEmpresa).toHaveBeenCalledWith(empresaMock);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/empresa-list']);
  });

  /**
   * Verifica el manejo de errores al intentar registrar una empresa.
   */
  it('should handle error when registering empresa', () => {
    const empresaMock = {
      UsuarioId: 1,
      EmpresaRuc: '1234567890',
      EmpresaRazonSocial: 'Empresa A',
      EmpresaNombreComercial: 'Comercial A',
      EmpresaAlias: 'Alias A',
      EmpresaDomicilioFiscal: 'Direccion A',
      EmpresaLogo: 'Logo A',
      RubroId: 1,
      EmpresaInformacionAdicional: 'Información A',
    };

    mockEmpresaService.registerEmpresa.and.returnValue(
      throwError(() => new Error('Error al registrar la empresa'))
    );

    component.empresa = empresaMock;
    component.register();

    expect(component.isSubmitting).toBeFalse();
    expect(component.errorMessage).toBe('Error al registrar empresa. Intente nuevamente.');
  });

  /**
   * Verifica que el RUC se limpie si la selección del campo es vacía.
   */
  it('should clear RUC when selection is empty', () => {
    const event = { value: '' };
    component.onRucSelectionChange(event);
    expect(component.empresa.EmpresaRuc).toBe('');
  });

  /**
   * Verifica que el RUC se mantenga cuando el valor de selección es válido.
   */
  it('should not clear RUC when selection has value', () => {
    const event = { value: '1234567890' };
    component.onRucSelectionChange(event);
    expect(component.empresa.EmpresaRuc).toBe('1234567890');
  });
});
