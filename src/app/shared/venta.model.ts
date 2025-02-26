export interface Venta {
    VentaId: number;
    VentaVenta: string;
    VentaCodigo: string;
    VentaFecha: Date;
    VentaMontoTotal: number;
    VentaMontoDescuento: number;
    VentaMontoImpuesto: number;
    VentaFormaPago: string;
    TipoComprobanteId: number;
    VentaRucCliente: number;
    UsuarioId: number;
    EmpresaId: number;
    ClienteId: number;
  }
  