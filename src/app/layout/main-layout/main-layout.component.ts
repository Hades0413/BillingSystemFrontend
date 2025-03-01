import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { SidebarService } from '../../sidebar/sidebar.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
})
export class MainLayoutComponent {
  constructor(public sidebarService: SidebarService) {}
}
