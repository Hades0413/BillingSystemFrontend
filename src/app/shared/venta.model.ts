export interface Venta {
  VentaId: number;
  VentaVenta: string;
  VentaCodigo: string;
  VentaFecha: Date;
  VentaMontoTotal: number;
  VentaMontoDescuento: number;
  VentaMontoImpuesto: number;
  FormaPago: string;
  TipoComprobanteId: number;
  ClienteRuc: string;
  UsuarioId: number;
  EmpresaId: number;
  ClienteId: number;
}
