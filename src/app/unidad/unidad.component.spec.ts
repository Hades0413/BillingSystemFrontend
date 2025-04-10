/**
 * @file Unit test suite for UnidadListComponent.
 * Esta suite de pruebas unitarias verifica la funcionalidad de la lista de unidades,
 * asegurando que los datos se obtienen correctamente del servicio y que se gestionan los errores de manera adecuada.
 */

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnidadListComponent } from './unidad.component';
import { UnidadService } from './unidad.service';
import { of, throwError } from 'rxjs';
import { Unidad } from '../shared/unidad.model';

describe('UnidadListComponent', () => {
  let component: UnidadListComponent;
  let fixture: ComponentFixture<UnidadListComponent>;
  let unidadService: jasmine.SpyObj<UnidadService>;

  /**
   * Configuración inicial del entorno de pruebas para el componente.
   * Crea un mock del servicio `UnidadService` y configura el entorno de pruebas.
   */
  beforeEach(async () => {
    unidadService = jasmine.createSpyObj('UnidadService', ['getUnidades']);

    await TestBed.configureTestingModule({
      declarations: [UnidadListComponent],
      providers: [{ provide: UnidadService, useValue: unidadService }],
    }).compileComponents();
  });

  /**
   * Se ejecuta antes de cada prueba para inicializar el componente y fixture.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Verifica que el componente se cree correctamente.
   * Esta prueba se asegura de que el componente sea instanciado correctamente
   * y no tenga errores durante su creación.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifica que se llame al método `getUnidades` de `UnidadService`
   * y se actualicen las unidades en el componente correctamente.
   * Esta prueba simula una respuesta exitosa del servicio, y valida que
   * las unidades se asignen correctamente al componente.
   */
  it('should call getUnidades on ngOnInit and populate unidades', () => {
    const mockUnidades: Unidad[] = [
      {
        UnidadId: 1,
        UnidadNombre: 'Unidad 1',
        UnidadInformacionAdicional: 'Información adicional 1',
      },
      {
        UnidadId: 2,
        UnidadNombre: 'Unidad 2',
        UnidadInformacionAdicional: 'Información adicional 2',
      },
    ];

    unidadService.getUnidades.and.returnValue(of(mockUnidades));

    component.ngOnInit(); // Se llama al ngOnInit para cargar las unidades

    expect(unidadService.getUnidades).toHaveBeenCalled(); // Verifica que se llamó al servicio
    expect(component.unidades).toEqual(mockUnidades); // Verifica que las unidades fueron asignadas correctamente
  });

  /**
   * Verifica el manejo de errores cuando `getUnidades` falla.
   * Esta prueba simula un error al obtener las unidades y asegura que el componente maneje el error adecuadamente.
   * Se espera que el componente registre el error en la consola y no actualice la lista de unidades.
   */
  it('should handle error if getUnidades fails', () => {
    const errorResponse = 'Error al obtener las unidades';
    unidadService.getUnidades.and.returnValue(throwError(errorResponse));

    spyOn(console, 'error'); // Se espía la función console.error para verificar que se registre el error

    component.ngOnInit(); // Se llama al ngOnInit, que debería manejar el error

    expect(unidadService.getUnidades).toHaveBeenCalled(); // Verifica que el servicio fue llamado
    expect(component.unidades.length).toBe(0); // Verifica que las unidades no se hayan actualizadas
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener las unidades',
      errorResponse
    ); // Verifica que el error fue registrado en la consola
  });
});
