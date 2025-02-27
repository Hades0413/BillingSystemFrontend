import { Component } from '@angular/core';
import { VentaComponent } from '../../venta/venta.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FacturaComponent } from '../../venta/factura.component';

@Component({
  selector: 'app-dashboard-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  imports: [
    VentaComponent,
    FacturaComponent,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatToolbarModule,
    MatButtonModule,
  ],
})
export class DashboardVentas {
  selectedTab: string = 'venta';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
