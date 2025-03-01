import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { SidebarService } from './sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
})
export class SidebarComponent {
  constructor(private router: Router, public sidebarService: SidebarService) {}

  get isSidebarClosed(): boolean {
    return this.sidebarService.isSidebarClosed;
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    // Implementar lógica de logout aquí
    this.router.navigate(['/login']);
  }
}
