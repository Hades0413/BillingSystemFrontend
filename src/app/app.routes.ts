import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardPrducto } from './features/productos/producto.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { DashboardRegisterComponent } from './features/register/register.component';

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
      { path: 'categorias', component: CategoriaComponent },/*
      { path: 'ventas', component: VentasComponent },*/
    ],
  },

  
];
