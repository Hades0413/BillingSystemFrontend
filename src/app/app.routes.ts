import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { RegisterEmpresaComponent } from './empresa/register-empresa.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ProductoComponent } from './producto/producto.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register-empresa', component: RegisterEmpresaComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'productos', component: ProductoComponent },/*
      { path: 'ventas', component: VentasComponent },*/
    ],
  },

  
];
