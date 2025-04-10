import { Component, OnInit } from '@angular/core';
import { Rubro } from '../shared/rubro.model';
import { RubroService } from './rubro.service';

/**
 * Componente encargado de mostrar una lista de rubros.
 *
 * Este componente se encarga de obtener los rubros desde el servicio correspondiente y mostrarlos
 * en la vista. Utiliza la suscripción a un observable para recibir los datos y manejar los errores
 * en caso de que ocurran.
 */
@Component({
  selector: 'app-rubro-list',
  templateUrl: './rubro.component.html',
  styleUrls: ['./rubro.component.css'],
})
export class RubroListComponent implements OnInit {
  // Lista de rubros que se mostrará en la vista.
  rubros: Rubro[] = [];

  /**
   * Constructor del componente.
   *
   * @param rubroService Servicio que maneja la obtención de los rubros desde una API.
   */
  constructor(private rubroService: RubroService) {}

  /**
   * Método de inicialización que se ejecuta cuando el componente se carga.
   *
   * Aquí se realiza la llamada al servicio `rubroService` para obtener los rubros.
   * Los datos obtenidos se asignan a la propiedad `rubros`, que a su vez es usada
   * para mostrar la lista en la vista.
   */
  ngOnInit(): void {
    // Llamada al servicio para obtener los rubros.
    this.rubroService.getRubros().subscribe(
      (data: Rubro[]) => {
        // Asignar los datos obtenidos a la propiedad `rubros`.
        this.rubros = data;
      },
      (error) => {
        // Manejo de errores en caso de que la solicitud falle.
        console.error('Error al obtener los rubros', error);
      }
    );
  }
}
