import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RubroListComponent } from './rubro.component'; // Importamos el componente standalone
import { RubroService } from './rubro.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas comunes como ngIf y ngFor
import { MatCardModule } from '@angular/material/card'; // Módulo de Material que podría ser necesario
import { MatButtonModule } from '@angular/material/button'; // Otro módulo de Material, si se usa en el componente
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

/**
 * Descripción de las pruebas unitarias del componente RubroListComponent
 * Estas pruebas unitarias verifican:
 * 1. Si el componente se crea correctamente.
 * 2. Si los rubros se cargan correctamente en la inicialización.
 * 3. Si se maneja correctamente un error al intentar cargar los rubros.
 */
describe('RubroListComponent', () => {
  let component: RubroListComponent;
  let fixture: ComponentFixture<RubroListComponent>;
  let httpMock: HttpTestingController;

  // Este bloque se ejecuta antes de cada prueba
  beforeEach(async () => {
    // Configuración del TestBed, donde importamos el componente y otros módulos necesarios
    await TestBed.configureTestingModule({
      imports: [
        RubroListComponent, // Importamos el componente standalone
        CommonModule, // Necesario para usar directivas como ngIf y ngFor
        MatCardModule, // Si el componente usa Material Design, importa los módulos necesarios
        MatButtonModule,
        HttpClientTestingModule, // Módulo necesario para simular las peticiones HTTP
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignora cualquier error por dependencias no declaradas en los tests
    }).compileComponents();
  });

  // Este bloque se ejecuta antes de cada test individual
  beforeEach(() => {
    fixture = TestBed.createComponent(RubroListComponent);
    component = fixture.componentInstance; // Instanciamos el componente
    httpMock = TestBed.inject(HttpTestingController); // Inyectamos HttpTestingController
    fixture.detectChanges(); // Detectamos cambios en la vista
  });

  /**
   * Prueba 1: Verifica que el componente se crea correctamente
   */
  it('should create the component', () => {
    expect(component).toBeTruthy(); // Si el componente es creado correctamente, la prueba pasa
  });

  /**
   * Prueba 2: Verifica que los rubros se carguen correctamente en la inicialización
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

    component.ngOnInit(); // Llamamos al método ngOnInit para cargar los rubros
    fixture.detectChanges(); // Detectamos cambios para que se reflejen en la vista

    // Simulamos la respuesta HTTP
    const req = httpMock.expectOne('/listar'); // Usamos la URL que se espera, sin acceso a 'rubroApiUrl'
    expect(req.request.method).toBe('GET'); // Verificamos que la solicitud HTTP sea GET
    req.flush(rubrosMock); // Simulamos que la respuesta con los rubros es exitosa

    // Verificamos que los rubros se han cargado correctamente
    expect(component.rubros).toEqual(rubrosMock); // Comprobamos que los rubros cargados sean iguales a los mockeados
  });

  /**
   * Prueba 3: Verifica que se maneje correctamente un error al cargar los rubros
   */
  it('should handle error when loading rubros', () => {
    const errorMock = new Error('Error al obtener los rubros');

    component.ngOnInit(); // Llamamos al método ngOnInit
    fixture.detectChanges(); // Detectamos cambios

    // Simulamos la respuesta de error HTTP
    const req = httpMock.expectOne('/listar'); // Usamos la URL que se espera, sin acceso a 'rubroApiUrl'
    expect(req.request.method).toBe('GET');
    req.flush(errorMock, { status: 500, statusText: 'Internal Server Error' }); // Simulamos un error HTTP

    spyOn(console, 'error'); // Espiamos la función console.error para verificar si se llama en caso de error

    // Verificamos que la consola registre el error
    expect(console.error).toHaveBeenCalledWith(
      'Error al obtener los rubros', // Mensaje que esperamos que se loguee
      jasmine.any(Error) // Verificamos que se haya lanzado un error
    );
  });

  // Después de cada prueba, se limpia cualquier petición pendiente
  afterEach(() => {
    httpMock.verify();
  });
});
