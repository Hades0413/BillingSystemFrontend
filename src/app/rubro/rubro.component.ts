import { Component, OnInit } from '@angular/core';
import { Rubro } from '../shared/rubro.model';
import { RubroService } from './rubro.service';

@Component({
  selector: 'app-rubro-list',
  templateUrl: './rubro.component.html',
  styleUrls: ['./rubro.component.css'],
})
export class RubroListComponent implements OnInit {
  rubros: Rubro[] = [];

  constructor(private rubroService: RubroService) {}

  ngOnInit(): void {
    this.rubroService.getRubros().subscribe(
      (data: Rubro[]) => {
        this.rubros = data;
      },
      (error) => {
        console.error('Error al obtener los rubros', error);
      }
    );
  }
}
