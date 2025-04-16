import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CategoriaService } from '../../categoria/categoria.service';
import { ProductoService } from '../../producto/producto.service';
import { VentaService } from '../../venta/venta.service';
import { CotizacionService } from '../../cotizacion/cotizacion.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  userEmail: string | null = '';
  userId: string | null = '';

  categoriesCount: number = 0;
  productsCount: number = 0;
  salesCount: number = 0;
  quotesCount: number = 0;

  chartDataCotizaciones: number[] = [];
  chartLabels: string[] = [];
  chartDataVentas: number[] = [];
  chartDataVentasPorMes: number[] = [];
  chartDataCotizacionesPorMes: number[] = [];

  chartCotizaciones: any;
  chartVentas: any;
  chartVentasPie: any;
  chartCotizacionesPie: any;

  currentMonth: string = '';
  currentYear: number = 0;

  totalVentasMonto: number = 0; // Variable para la suma del monto total de ventas
  totalCotizacionesMonto: number = 0; // Variable para la suma del monto total de cotizaciones

  constructor(
    private authService: AuthService,
    private router: Router,
    private categoriaService: CategoriaService,
    private productoService: ProductoService,
    private ventaService: VentaService,
    private cotizacionService: CotizacionService
  ) {}

  ngOnInit(): void {
    Chart.register(...registerables);

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
    // Cargar datos de categorías
    this.categoriaService.getCategoriasPorUsuario().subscribe(
      (response) => {
        this.categoriesCount = response.data.length;
      },
      (error) => {
        console.error('Error al obtener categorías:', error);
      }
    );

    // Cargar datos de productos
    this.productoService.getProductosPorUsuario(usuarioId).subscribe(
      (response) => {
        this.productsCount = response.data.length;
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );

    // Cargar ventas
    this.ventaService.getVentasPorUsuario(usuarioId).subscribe(
      (response) => {
        if (response && response.data && Array.isArray(response.data)) {
          const ventas = response.data;
          this.salesCount = ventas.length;

          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const ventasDelMes = ventas.filter((venta: any) => {
            const ventaDate = new Date(venta.ventaFecha);
            const ventaMonth = ventaDate.getMonth();
            const ventaYear = ventaDate.getFullYear();

            return ventaMonth === currentMonth && ventaYear === currentYear;
          });

          const dailySales: number[] = new Array(31).fill(0);
          let totalMontoVentas: number = 0; // Variable para acumular el monto de las ventas

          ventasDelMes.forEach((venta: any) => {
            const ventaDate = new Date(venta.ventaFecha);
            const dayOfMonth = ventaDate.getDate() - 1;
            dailySales[dayOfMonth]++;
            totalMontoVentas += venta.ventaMontoTotal; // Sumar el monto de cada venta
          });

          this.totalVentasMonto = totalMontoVentas; // Asignar la suma total de ventas

          this.chartLabels = Array.from({ length: 31 }, (_, i) => `${i + 1}`);
          this.chartDataVentas = dailySales;

          this.createVentasChart();
        }

        const monthlySalesCount: number[] = new Array(12).fill(0);
        const ventas = response.data;
        ventas.forEach((venta: any) => {
          const ventaDate = new Date(venta.ventaFecha);
          const month = ventaDate.getMonth();
          monthlySalesCount[month]++;
        });

        this.chartDataVentasPorMes = monthlySalesCount;
        this.createVentasPieChart();
      },
      (error) => {
        console.error('Error al obtener ventas:', error);
      }
    );

    // Cargar cotizaciones
    this.cotizacionService.getCotizacionesPorUsuario(usuarioId).subscribe(
      (response) => {
        if (response && response.data && Array.isArray(response.data)) {
          const cotizaciones = response.data;
          this.quotesCount = cotizaciones.length;

          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const cotizacionesDelMes = cotizaciones.filter((cotizacion: any) => {
            const cotizacionDate = new Date(cotizacion.cotizacionFecha);
            const cotizacionMonth = cotizacionDate.getMonth();
            const cotizacionYear = cotizacionDate.getFullYear();

            return (
              cotizacionMonth === currentMonth && cotizacionYear === currentYear
            );
          });

          const dailyQuotes: number[] = new Array(31).fill(0);
          let totalMontoCotizaciones: number = 0; // Variable para acumular el monto total de las cotizaciones

          cotizacionesDelMes.forEach((cotizacion: any) => {
            const cotizacionDate = new Date(cotizacion.cotizacionFecha);
            const dayOfMonth = cotizacionDate.getDate() - 1;
            dailyQuotes[dayOfMonth]++;
            totalMontoCotizaciones += cotizacion.cotizacionMontoTotal; // Sumar el monto de cada cotización
          });

          this.totalCotizacionesMonto = totalMontoCotizaciones; // Asignar la suma total de cotizaciones

          this.chartLabels = Array.from(
            { length: 31 },
            (_, i) => `${i + 1} ${this.currentMonth}`
          );
          this.chartDataCotizaciones = dailyQuotes;

          this.createCotizacionesChart();

          const monthlyQuotesCount: number[] = new Array(12).fill(0);
          cotizaciones.forEach((cotizacion: any) => {
            const cotizacionDate = new Date(cotizacion.cotizacionFecha);
            const month = cotizacionDate.getMonth();
            monthlyQuotesCount[month]++;
          });

          this.chartDataCotizacionesPorMes = monthlyQuotesCount;
          this.createCotizacionesPieChart();
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

  createVentasPieChart(): void {
    if (this.chartVentasPie) {
      this.chartVentasPie.destroy();
    }

    const totalVentas = this.chartDataVentasPorMes.reduce(
      (sum, value) => sum + value,
      0
    );
    const ventasPorMes = this.chartDataVentasPorMes.map(
      (value) => (value / totalVentas) * 100
    );

    this.chartVentasPie = new Chart('ventasPieChart', {
      type: 'pie',
      data: {
        labels: [
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
        ],
        datasets: [
          {
            data: ventasPorMes,
            backgroundColor: [
              '#66BB6A',
              '#42A5F5',
              '#FFEB3B',
              '#FF7043',
              '#8E24AA',
              '#3949AB',
              '#8BC34A',
              '#FF5722',
              '#00ACC1',
              '#607D8B',
              '#FF9800',
              '#CDDC39',
            ],
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
            text: `Ventas por Mes`,
            font: {
              size: 18,
              family: 'Arial, sans-serif',
            },
            color: '#000000',
          },
        },
      },
    });
  }

  createCotizacionesPieChart(): void {
    if (this.chartCotizacionesPie) {
      this.chartCotizacionesPie.destroy();
    }

    const totalCotizaciones = this.chartDataCotizacionesPorMes.reduce(
      (sum, value) => sum + value,
      0
    );
    const cotizacionesPorMes = this.chartDataCotizacionesPorMes.map(
      (value) => (value / totalCotizaciones) * 100
    );

    this.chartCotizacionesPie = new Chart('cotizacionesPieChart', {
      type: 'pie',
      data: {
        labels: [
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
        ],
        datasets: [
          {
            data: cotizacionesPorMes,
            backgroundColor: [
              '#42A5F5',
              '#66BB6A',
              '#FFEB3B',
              '#FF7043',
              '#8E24AA',
              '#3949AB',
              '#8BC34A',
              '#FF5722',
              '#00ACC1',
              '#607D8B',
              '#FF9800',
              '#CDDC39',
            ],
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
            text: `Cotizaciones por Mes`,
            font: {
              size: 18,
              family: 'Arial, sans-serif',
            },
            color: '#000000',
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
