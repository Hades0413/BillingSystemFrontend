export interface Cotizacion {
  CotizacionId: number;
  CotizacionCodigo: string;
  CotizacionFecha: Date;
  CotizacionMontoTotal: number;
  CotizacionMontoDescuento: number;
  CotizacionMontoImpuesto: number;
  UsuarioId: number;
  EmpresaId: number;
  ClienteId: number;
}
