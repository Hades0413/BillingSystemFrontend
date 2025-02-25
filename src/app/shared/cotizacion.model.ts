export interface Cotizacion {
    CotizacionId: number;
    CotizacionCodigo: string;
    CotizacionFecha: Date;
    CotizacionMontoTotal: number;
    CotizacionMontoDescuento: number;
    CotizacionMontoImpuesto: string;
    UsuarioId: number;
    EmpresaId: number;
    ClienteId: number;
  }
  