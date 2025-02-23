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

  rubros: Rubro[] = [];
  empresaTieneRuc: boolean = true;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private empresaService: EmpresaService,
    private rubroService: RubroService,
    private router: Router
  ) {}

  ngOnInit() {
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
    if (this.currentStep === 1) {
      this.currentStep++;
    } else if (this.currentStep === 2) {
      this.register();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  register() {
    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService.registerUser(this.user).subscribe(
      (userResponse: any) => {
        console.log('Respuesta del registro de usuario:', userResponse);

        this.empresa.UsuarioId = userResponse.data.usuarioId;
        console.log('Datos de la empresa con UsuarioId asignado:', this.empresa);

        this.empresaService.registerEmpresa(this.empresa).subscribe(
          (empresaResponse: any) => {
            console.log('Respuesta del registro de empresa:', empresaResponse);
            Swal.fire('Éxito', 'Empresa registrada con éxito', 'success');
            this.router.navigate(['/login']);
            this.isSubmitting = false;
          },
          (error: any) => {
            this.isSubmitting = false;
            if (error?.error?.message === 'Ya existe una empresa con este RUC.') {
              Swal.fire('Error', 'Ya existe una empresa con este RUC. Por favor, verifique el RUC e intente nuevamente.', 'error');
            } else {
              Swal.fire('Error', 'Error al registrar empresa. Intente nuevamente.', 'error');
            }
            console.error('Error al registrar empresa:', error);
          }
        );
      },
      (error: any) => {
        this.isSubmitting = false;
        if (error?.error?.message === 'Ya existe un usuario con este correo.') {
          Swal.fire('Error', 'Ya existe un usuario con este correo. Por favor, utilice otro correo electrónico.', 'error');
        } else {
          Swal.fire('Error', 'Error al registrar usuario. Intente nuevamente.', 'error');
        }
        console.error('Error al registrar usuario:', error);
      }
    );
  }

  onRucSelectionChange(event: any): void {
    if (!event.value) {
      this.empresa.EmpresaRuc = '';
    }
  }
}
