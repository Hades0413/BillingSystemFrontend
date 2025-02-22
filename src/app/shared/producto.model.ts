export interface Producto {
	ProductoId: number;
	ProductoCodigo: string;
	ProductoNombre: string;
	ProductoStock: number;
	ProductoPrecioVenta: number;
	ProductoImpuestoIgv: number;
	UnidadId: number;
	CategoriaId: number;
	UsuarioId: number;
	ProductoImagen: string;
	ProductoFechaUltimaActualizacion: string;
}