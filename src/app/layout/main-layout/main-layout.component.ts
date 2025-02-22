import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; 
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
})
export class MainLayoutComponent {
}
