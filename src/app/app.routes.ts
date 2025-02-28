import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardPrducto } from './features/productos/producto.component';
import { DashboardRegisterComponent } from './features/register/register.component';
import { DashboardVentas } from './features/ventas/ventas.component';
import { CotizacionRegisterComponent } from './cotizacion/cotizacion-register.component';
import { RegisterVentaComponent } from './venta/register-venta.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: DashboardRegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'productos', component: DashboardPrducto },
      { path: 'ventas', component: DashboardVentas },
      { path: 'crear-cotizacion', component: CotizacionRegisterComponent }, 
      { path: 'crear-venta', component: RegisterVentaComponent } /*
      { path: 'ventas', component: VentasComponent },*/,
    ],
  },
];
