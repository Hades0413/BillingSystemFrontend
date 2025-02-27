import { Component, OnInit } from '@angular/core';
import { TipoComprobanteService } from './tipo-comprobante.service';

@Component({
  selector: 'app-tipo-comprobante',
  templateUrl: './tipo-comprobante.component.html',
  styleUrls: ['./tipo-comprobante.component.css']
})
export class TipoComprobanteComponent implements OnInit {
  tipoComprobantes: any[] = [];
  errorMessage: string = '';

  constructor(private tipoComprobanteService: TipoComprobanteService) {}

  ngOnInit() {
    this.obtenerTiposComprobante();
  }

  obtenerTiposComprobante() {
    this.tipoComprobanteService.getTipoComprobantes().subscribe(
      (data) => {
        console.log('Tipos de Comprobante:', data);
        this.tipoComprobantes = data;
      },
      (error) => {
        console.error('Error al obtener los tipos de comprobante', error);
        this.errorMessage = error;
      }
    );
  }
}
