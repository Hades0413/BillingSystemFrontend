/**
 * @file Suite de pruebas unitarias para el componente VentaComponent.
 * Esta suite de pruebas valida el comportamiento de `VentaComponent` asegurando que:
 * 1. Se manejen correctamente las ventas de un usuario.
 * 2. Se maneje correctamente la obtención de clientes.
 * 3. Se verifiquen las funcionalidades de paginación y visualización de detalles de venta.
 * 4. Se gestionen adecuadamente los errores y las respuestas vacías.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentaComponent } from './venta.component';
import { VentaService } from './venta.service';
import { ClienteService } from '../cliente/cliente.service';
import { EmpresaService } from '../empresa/empresa.service';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { VentaDetalleComponent } from './venta-detalle.component';

describe('VentaComponent', () => {
  let component: VentaComponent;
  let fixture: ComponentFixture<VentaComponent>;

  // Mocks de los servicios utilizados en el componente
  let mockVentaService: jasmine.SpyObj<VentaService>;
  let mockClienteService: jasmine.SpyObj<ClienteService>;
  let mockEmpresaService: jasmine.SpyObj<EmpresaService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;

  /**
   * Configuración inicial de los mocks y el entorno de pruebas.
   * Los servicios son reemplazados por espías de Jasmine para simular las respuestas.
   */
  beforeEach(async () => {
    mockVentaService = jasmine.createSpyObj('VentaService', [
      'getVentasPorUsuario',
    ]);
    mockClienteService = jasmine.createSpyObj('ClienteService', [
      'getClientes',
    ]);
    mockEmpresaService = jasmine.createSpyObj('EmpresaService', [
      'listarEmpresas',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['listarUsuarios']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [VentaComponent, VentaDetalleComponent],
      providers: [
        { provide: VentaService, useValue: mockVentaService },
        { provide: ClienteService, useValue: mockClienteService },
        { provide: EmpresaService, useValue: mockEmpresaService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA], // No valida errores de esquema en el HTML
    }).compileComponents();
  });

  /**
   * Inicializa el componente y la fixture antes de cada prueba.
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(VentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Verifica que el componente se cree correctamente.
   * Esta prueba valida que no ocurran errores en la inicialización del componente.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Verifica que el `usuarioId` se inicialice correctamente a partir de `localStorage`.
   * Además, se asegura que se llame al servicio `getVentasPorUsuario` con el `usuarioId` correcto.
   */
  it('should initialize usuarioId from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('123'); // Se simula el valor del localStorage
    component.ngOnInit(); // Se inicializa el componente
    expect(component.usuarioId).toBe(123); // Verifica que `usuarioId` se inicialice correctamente
    expect(mockVentaService.getVentasPorUsuario).toHaveBeenCalledWith(123); // Verifica que se haya llamado al servicio con el id correcto
  });

  /**
   * Verifica el manejo de una respuesta vacía de ventas.
   * Si no se encuentran ventas, el componente debe asignar el mensaje adecuado y mantener la lista de ventas vacía.
   */
  it('should handle empty ventas response', () => {
    mockVentaService.getVentasPorUsuario.and.returnValue(
      of({ message: 'No se encontraron ventas para el usuario', data: [] })
    );
    component.listarVentasPorUsuario(123); // Llama al método para listar ventas
    expect(component.errorMessage).toBe(
      'No se encontraron ventas para el usuario'
    );
    expect(component.ventas).toEqual([]); // Verifica que la lista de ventas esté vacía
  });

  /**
   * Verifica que el componente maneje correctamente un error al obtener las ventas.
   * El mensaje de error debe actualizarse correctamente y no deben mostrarse ventas.
   */
  it('should handle error when getting ventas', () => {
    mockVentaService.getVentasPorUsuario.and.returnValue(
      throwError(() => new Error('Error al obtener ventas'))
    );
    component.listarVentasPorUsuario(123); // Simula un error al obtener ventas
    expect(component.errorMessage).toBe(
      'Hubo un problema al obtener las ventas'
    );
  });

  /**
   * Verifica que se cree un mapa de clientes correctamente cuando los clientes se obtienen con éxito.
   * El mapa debe relacionar el `clienteId` con el nombre del cliente.
   */
  it('should create cliente map when clients are fetched successfully', () => {
    mockClienteService.getClientes.and.returnValue(
      of([
        {
          clienteId: 1,
          clienteNombreLegal: 'Cliente A',
          clienteRuc: '12345',
          clienteDni: '987654321',
          clienteDireccion: 'Direccion A',
          tipoClienteId: 1,
          clienteFechaCreacion: '2021-01-01',
        },
      ])
    );
    component.listarVentasPorUsuario(123); // Llama al método para listar ventas
    expect(component.clienteMap).toEqual({ 1: 'Cliente A' }); // Verifica que el mapa de clientes se haya creado correctamente
  });

  /**
   * Verifica que el componente maneje el error al obtener los clientes de manera adecuada.
   * El mensaje de error debe actualizarse correctamente.
   */
  it('should handle error when getting clientes', () => {
    mockClienteService.getClientes.and.returnValue(
      throwError(() => new Error('Error al obtener clientes'))
    );
    component.listarVentasPorUsuario(123); // Simula un error al obtener clientes
    expect(component.errorMessage).toBe('Error al obtener clientes');
  });

  /**
   * Verifica la funcionalidad de paginación de las ventas.
   * Asegura que solo las ventas que coinciden con el término de búsqueda se muestren en la paginación.
   */
  it('should paginate sales correctly', () => {
    component.ventas = [
      {
        VentaId: 1,
        VentaCodigo: '123',
        FormaPago: 'Efectivo',
        ClienteRuc: '12345',
        VentaVenta: 'Venta A',
        VentaFecha: new Date('2021-01-01'),
        VentaMontoTotal: 100,
        VentaMontoDescuento: 10,
        VentaMontoImpuesto: 20,
        TipoComprobanteId: 1,
        UsuarioId: 1,
        EmpresaId: 1,
        ClienteId: 1,
      },
      {
        VentaId: 2,
        VentaCodigo: '124',
        FormaPago: 'Crédito',
        ClienteRuc: '12346',
        VentaVenta: 'Venta B',
        VentaFecha: new Date('2021-01-02'),
        VentaMontoTotal: 200,
        VentaMontoDescuento: 20,
        VentaMontoImpuesto: 40,
        TipoComprobanteId: 2,
        UsuarioId: 2,
        EmpresaId: 2,
        ClienteId: 2,
      },
    ];
    component.searchTerm = 'Venta A'; // Establece un término de búsqueda
    component.paginateSales(); // Llama a la paginación
    expect(component.paginatedVentas.length).toBe(1); // Verifica que solo se pagine una venta
    expect(component.paginatedVentas[0].VentaVenta).toBe('Venta A'); // Verifica que la venta paginada coincida con el término de búsqueda
  });

  /**
   * Verifica que se abra el componente `VentaDetalleComponent` cuando se visualicen los detalles de una venta.
   * Se asegura que se pase la información correcta al componente de detalles.
   */
  it('should open VentaDetalleComponent when viewing details of a sale', () => {
    const venta = {
      VentaId: 1,
      VentaCodigo: '123',
      VentaVenta: 'Venta A',
      VentaFecha: new Date(),
      VentaMontoTotal: 100,
      VentaMontoDescuento: 10,
      VentaMontoImpuesto: 20,
      FormaPago: 'Efectivo',
      TipoComprobanteId: 1,
      ClienteRuc: '12345',
      ClienteId: 1,
      UsuarioId: 1,
      EmpresaId: 1,
    };
    component.verDetallesVenta(venta); // Verifica los detalles de una venta
    expect(mockDialog.open).toHaveBeenCalledWith(VentaDetalleComponent, {
      data: jasmine.any(Object),
      width: '800px',
    }); // Verifica que el diálogo se haya abierto con el componente de detalles
  });

  /**
   * Verifica que el componente navegue correctamente a la ruta de creación de ventas.
   */
  it('should navigate to /crear-venta when creating a new sale', () => {
    component.irACrearVenta(); // Llama a la función de creación de ventas
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/crear-venta']); // Verifica que la navegación a la ruta correcta ocurra
  });
});
