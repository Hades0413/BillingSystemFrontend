import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CategoriaService } from '../../categoria/categoria.service';
import { ProductoService } from '../../producto/producto.service';
import { VentaService } from '../../venta/venta.service';
import { CotizacionService } from '../../cotizacion/cotizacion.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userEmail: string | null = '';
  userId: string | null = '';

  // Estadísticas
  categoriesCount: number = 0;
  productsCount: number = 0;
  salesCount: number = 0;
  quotesCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private cotizacionService: CotizacionService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
  }

  checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    this.userEmail = localStorage.getItem('userEmail');
    this.userId = localStorage.getItem('UsuarioId');
    if (this.userId) {
      this.loadDashboardData(parseInt(this.userId, 10));
    }
  }

  // Cargar las estadísticas del dashboard
  loadDashboardData(usuarioId: number): void {
    this.categoriaService.getCategoriasPorUsuario().subscribe(
      (response) => {
        this.categoriesCount = response.data.length;
      },
      (error) => {
        console.error('Error al obtener categorías:', error);
      }
    );

    this.productoService.getProductosPorUsuario(usuarioId).subscribe(
      (response) => {
        this.productsCount = response.data.length;
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );

    this.ventaService.getVentasPorUsuario(usuarioId).subscribe(
      (response) => {
        this.salesCount = response.data.length;
      },
      (error) => {
        console.error('Error al obtener ventas:', error);
      }
    );

    this.cotizacionService.getCotizacionesPorUsuario(usuarioId).subscribe(
      (cotizaciones) => {
        this.quotesCount = cotizaciones.length;
      },
      (error) => {
        console.error('Error al obtener cotizaciones:', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
  }
}
