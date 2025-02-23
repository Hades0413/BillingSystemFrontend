import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

// Importar módulos necesarios de Angular Material y CommonModule
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { MatIconModule } from '@angular/material/icon'; // Para los iconos mat-icon
import { MatButtonModule } from '@angular/material/button'; // Para el botón

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [
    CommonModule, // Asegúrate de importar CommonModule
    MatIconModule, // Importar MatIconModule para mat-icon
    MatButtonModule, // Si estás usando botones de Angular Material
  ],
})
export class SidebarComponent {
  isSidebarClosed: boolean = false; // Variable para controlar el estado del sidebar

  constructor(private authService: AuthService, private router: Router) {}

  // Función para alternar la visibilidad del sidebar
  toggleSidebar(): void {
    this.isSidebarClosed = !this.isSidebarClosed;

    // Alternar la clase 'sidebar-closed' en el contenedor principal
    const layoutElement = document.querySelector('.main-layout');
    if (layoutElement) {
      if (this.isSidebarClosed) {
        layoutElement.classList.add('sidebar-closed');
      } else {
        layoutElement.classList.remove('sidebar-closed');
      }
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}