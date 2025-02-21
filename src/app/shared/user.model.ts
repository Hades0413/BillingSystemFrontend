export class User {
    UsuarioId: number;
    UsuarioCorreo: string;
    UsuarioContrasena: string;
    UsuarioTelefono: string;
    UsuarioNombres: string;
    UsuarioApellidos: string;
    UsuarioFechaUltimaActualizacion: Date;
  
    constructor(
      UsuarioId: number,
      UsuarioCorreo: string,
      UsuarioContrasena: string,
      UsuarioTelefono: string,
      UsuarioNombres: string,
      UsuarioApellidos: string,
      UsuarioFechaUltimaActualizacion: Date
    ) {
      this.UsuarioId = UsuarioId;
      this.UsuarioCorreo = UsuarioCorreo;
      this.UsuarioContrasena = UsuarioContrasena;
      this.UsuarioTelefono = UsuarioTelefono;
      this.UsuarioNombres = UsuarioNombres;
      this.UsuarioApellidos = UsuarioApellidos;
      this.UsuarioFechaUltimaActualizacion = UsuarioFechaUltimaActualizacion;
    }
  }
  