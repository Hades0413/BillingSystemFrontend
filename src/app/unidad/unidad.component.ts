import { Component, OnInit } from '@angular/core';
import { Unidad } from '../shared/unidad.model';
import { UnidadService } from './unidad.service';

@Component({
  selector: 'app-unidad-list',
  templateUrl: './unidad.component.html',
  styleUrls: ['./unidad.component.css'],
})
export class UnidadListComponent implements OnInit {
  unidades: Unidad[] = [];

  constructor(private unidadService: UnidadService) {}

  ngOnInit(): void {
    this.unidadService.getUnidades().subscribe(
      (data: Unidad[]) => {
        this.unidades = data;
      },
      (error) => {
        console.error('Error al obtener las unidades', error);
      }
    );
  }
}
