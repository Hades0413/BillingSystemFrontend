import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../auth/auth.service';
import { EmpresaService } from '../../empresa/empresa.service';
import { RubroService } from '../../rubro/rubro.service';
import { Empresa } from '../../shared/empresa.model';
import { Rubro } from '../../shared/rubro.model';
import Swal from 'sweetalert2';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
  ],
  providers: [AuthService, EmpresaService, RubroService],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class DashboardRegisterComponent {
  currentStep = 1;
  isSubmitting = false;
  errorMessage: string | null = null;
  rubros: Rubro[] = [];
  empresaTieneRuc = true;

  user: User = {
    UsuarioId: 0,
    UsuarioCorreo: '',
    UsuarioContrasena: '',
    UsuarioTelefono: '',
    UsuarioNombres: '',
    UsuarioApellidos: '',
    UsuarioFechaUltimaActualizacion: new Date(),
  };

  empresa: Empresa = {
    UsuarioId: 0,
    EmpresaRuc: '',
    EmpresaRazonSocial: '',
    EmpresaNombreComercial: '',
    EmpresaAlias: '',
    EmpresaDomicilioFiscal: '',
    EmpresaLogo: '',
    RubroId: 1,
    EmpresaInformacionAdicional: '',
  };

  constructor(
    private authService: AuthService,
    private empresaService: EmpresaService,
    private rubroService: RubroService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadRubros();
  }

  loadRubros() {
    this.rubroService.getRubros().subscribe(
      (rubros: any[]) => {
        this.rubros = rubros.map((rubro) => ({
          RubroId: rubro.rubroId,
          RubroNombre: rubro.rubroNombre,
          RubroFechaUltimaActualizacion: rubro.rubroFechaUltimaActualizacion,
        }));
      },
      (error: any) => {
        this.errorMessage = 'Error al obtener los rubros. Intente nuevamente.';
      }
    );
  }

  nextStep() {
    if (this.currentStep === 1 && this.validateUserData()) {
      this.currentStep++;
    } else if (this.currentStep === 2 && this.validateEmpresaData()) {
      this.validateEmpresaAndRegister();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateUserData(): boolean {
    if (
      !this.user.UsuarioCorreo ||
      !this.user.UsuarioContrasena ||
      !this.user.UsuarioNombres ||
      !this.user.UsuarioApellidos
    ) {
      Swal.fire(
        'Error',
        'Todos los campos del usuario son obligatorios.',
        'error'
      );
      return false;
    }
    return true;
  }

  validateEmpresaData(): boolean {
    if (
      !this.empresa.EmpresaRuc ||
      !this.empresa.EmpresaRazonSocial ||
      !this.empresa.EmpresaNombreComercial
    ) {
      Swal.fire(
        'Error',
        'Todos los campos de la empresa son obligatorios.',
        'error'
      );
      return false;
    }
    return true;
  }

  validateEmpresaAndRegister() {
    this.isSubmitting = true;
    this.errorMessage = null;

    this.empresaService.listarPorRuc(this.empresa.EmpresaRuc).subscribe(
      (empresas: Empresa[]) => {
        if (empresas.length > 0) {
          Swal.fire('Error', 'Ya existe una empresa con este RUC.', 'error');
          this.isSubmitting = false;
        } else {
          this.registerUser();
        }
      },
      (error: any) => {
        if (error.status === 404) {
          this.registerUser();
        } else {
          this.isSubmitting = false;
          Swal.fire('Error', 'Hubo un problema al verificar el RUC.', 'error');
        }
      }
    );
  }

  registerUser() {
    this.authService.registerUser(this.user).subscribe(
      (userResponse: any) => {
        this.empresa.UsuarioId = userResponse.data.usuarioId;
        this.registerEmpresa();
      },
      (error: any) => {
        this.isSubmitting = false;
        Swal.fire('Error', 'Error al registrar usuario.', 'error');
      }
    );
  }

  registerEmpresa() {
    this.empresaService.registerEmpresa(this.empresa).subscribe(
      () => {
        Swal.fire('Éxito', 'Empresa registrada con éxito', 'success');
        this.router.navigate(['/login']);
        this.isSubmitting = false;
      },
      (error: any) => {
        this.isSubmitting = false;
        Swal.fire('Error', 'Error al registrar empresa.', 'error');
      }
    );
  }

  onRucSelectionChange(event: any): void {
    if (!event.value) {
      this.empresa.EmpresaRuc = '';
    }
  }
}
