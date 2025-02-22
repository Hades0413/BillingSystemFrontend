import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { RegisterEmpresaComponent } from './empresa/register-empresa.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginComponent,
    RegisterComponent,
    RegisterEmpresaComponent,
    RouterModule,
  ],
})
export class AppModule {}

/**
 * Eliminar archivo
 */