/*export interface Cliente {
    ClienteId: number;
    TipoClienteId: number;
    ClienteRuc: string;
    ClienteDni: string;
    ClienteNombreLegal: string;
    ClienteDireccion: string;
    ClienteFechaCreacion: Date;
  }*/

    export interface Cliente {
      clienteId: number;
      clienteNombreLegal: string;
      clienteRuc: string;
      clienteDni: string;
      clienteDireccion: string;
      tipoClienteId: number;
      clienteFechaCreacion: string;
    }
    
  