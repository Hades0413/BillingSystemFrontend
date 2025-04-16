import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CategoriaService } from '../../categoria/categoria.service';
import { ProductoService } from '../../producto/producto.service';
import { VentaService } from '../../venta/venta.service';
import { CotizacionService } from '../../cotizacion/cotizacion.service';
import { Chart, registerables } from 'chart.js'; // Importamos chart.js

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

  // Datos para los gráficos
  chartDataCotizaciones: number[] = [];
  chartLabels: string[] = []; // Etiquetas para cada día del mes actual
  chartDataVentas: number[] = []; // Datos para ventas por día

  // Instanciamos los gráficos
  chartCotizaciones: any;
  chartVentas: any;

  currentMonth: string = '';
  currentYear: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private cotizacionService: CotizacionService
  ) {}

  ngOnInit(): void {
    // Registramos todos los elementos necesarios de chart.js
    Chart.register(...registerables);

    // Obtenemos el mes y año actuales
    const currentDate = new Date();
    this.currentMonth = this.getMonthName(currentDate.getMonth());
    this.currentYear = currentDate.getFullYear();

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
        if (response && response.data && Array.isArray(response.data)) {
          const ventas = response.data;
          this.salesCount = ventas.length;

          // Filtramos las ventas para el mes actual
          const currentMonth = new Date().getMonth(); // Mes actual (0-11)
          const currentYear = new Date().getFullYear(); // Año actual

          // Creamos un arreglo con el conteo de ventas por día del mes
          const ventasDelMes = ventas.filter((venta: any) => {
            const ventaDate = new Date(venta.ventaFecha); // Convertimos la fecha
            const ventaMonth = ventaDate.getMonth(); // Mes de la venta
            const ventaYear = ventaDate.getFullYear(); // Año de la venta

            return ventaMonth === currentMonth && ventaYear === currentYear;
          });

          const dailySales: number[] = new Array(31).fill(0); // Inicializamos un arreglo de 31 días

          // Contamos las ventas por día
          ventasDelMes.forEach((venta: any) => {
            const ventaDate = new Date(venta.ventaFecha);
            const dayOfMonth = ventaDate.getDate() - 1; // Obtenemos el día (de 0 a 30)
            dailySales[dayOfMonth]++;
          });

          // Asignamos las etiquetas del gráfico (días del mes)
          this.chartLabels = Array.from(
            { length: 31 },
            (_, i) => `${i + 1} ${this.currentMonth}`
          );
          this.chartDataVentas = dailySales;

          // Inicializamos el gráfico de ventas
          this.createVentasChart();
        } else {
          console.error('Error en la estructura de la respuesta de ventas');
        }
      },
      (error) => {
        console.error('Error al obtener ventas:', error);
      }
    );

    this.cotizacionService.getCotizacionesPorUsuario(usuarioId).subscribe(
      (response) => {
        if (response && response.data && Array.isArray(response.data)) {
          const cotizaciones = response.data;
          this.quotesCount = cotizaciones.length;

          // Filtramos las cotizaciones para el mes actual
          const currentMonth = new Date().getMonth(); // Mes actual (0-11)
          const currentYear = new Date().getFullYear(); // Año actual

          // Creamos un arreglo con el conteo de cotizaciones por día del mes
          const cotizacionesDelMes = cotizaciones.filter((cotizacion: any) => {
            const cotizacionDate = new Date(cotizacion.cotizacionFecha); // Convertimos la fecha
            const cotizacionMonth = cotizacionDate.getMonth(); // Mes de la cotización
            const cotizacionYear = cotizacionDate.getFullYear(); // Año de la cotización

            return (
              cotizacionMonth === currentMonth && cotizacionYear === currentYear
            );
          });

          const dailyQuotes: number[] = new Array(31).fill(0); // Inicializamos un arreglo de 31 días

          // Contamos las cotizaciones por día
          cotizacionesDelMes.forEach((cotizacion: any) => {
            const cotizacionDate = new Date(cotizacion.cotizacionFecha);
            const dayOfMonth = cotizacionDate.getDate() - 1; // Obtenemos el día (de 0 a 30)
            dailyQuotes[dayOfMonth]++;
          });

          // Asignamos las etiquetas del gráfico (días del mes)
          this.chartLabels = Array.from(
            { length: 31 },
            (_, i) => `${i + 1} ${this.currentMonth}`
          );
          this.chartDataCotizaciones = dailyQuotes;

          // Inicializamos el gráfico de cotizaciones
          this.createCotizacionesChart();
        } else {
          console.error(
            'Error en la estructura de la respuesta de cotizaciones'
          );
        }
      },
      (error) => {
        console.error('Error al obtener cotizaciones:', error);
      }
    );
  }

  // Función para obtener el nombre del mes
  getMonthName(monthIndex: number): string {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return months[monthIndex];
  }

  createCotizacionesChart(): void {
    if (this.chartCotizaciones) {
      this.chartCotizaciones.destroy();
    }

    this.chartCotizaciones = new Chart('cotizacionesChart', {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Cotizaciones por día',
            data: this.chartDataCotizaciones,
            fill: false,
            borderColor: '#42A5F5',
            tension: 0.1,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14,
                family: 'Arial, sans-serif',
              },
              color: '#000000',
            },
          },
          title: {
            display: true,
            text: `Cotizaciones por Día en ${this.currentMonth} ${this.currentYear}`,
            font: {
              size: 18,
              family: 'Arial, sans-serif',
            },
            color: '#000000',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
  }

  createVentasChart(): void {
    if (this.chartVentas) {
      this.chartVentas.destroy();
    }

    this.chartVentas = new Chart('ventasChart', {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'Ventas por día',
            data: this.chartDataVentas,
            fill: false,
            borderColor: '#66BB6A',
            tension: 0.1,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14,
                family: 'Arial, sans-serif',
              },
              color: '#000000',
            },
          },
          title: {
            display: true,
            text: `Ventas por Día en ${this.currentMonth} ${this.currentYear}`,
            font: {
              size: 18,
              family: 'Arial, sans-serif',
            },
            color: '#000000',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    });
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
