import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { EmpresaService } from './empresa.service';
import { RubroService } from '../rubro/rubro.service';
import { Empresa } from '../shared/empresa.model';
import { Rubro } from '../shared/rubro.model';

@Component({
  selector: 'app-register-empresa',
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
  templateUrl: './register-empresa.component.html',
  styleUrls: ['./register-empresa.component.css'],
  providers: [EmpresaService, RubroService],
})
export class RegisterEmpresaComponent implements OnInit {
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
  isSubmitting = false;
  errorMessage: string | null = null;
  empresaTieneRuc: boolean = true; 

  constructor(
    private empresaService: EmpresaService,
    private rubroService: RubroService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.rubroService.getRubros().subscribe(
      (rubros: any[]) => {
        this.rubros = rubros.map(rubro => ({
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

  register(): void {
    this.isSubmitting = true;
    this.errorMessage = null;

    this.empresaService.registerEmpresa(this.empresa).subscribe(
      (response: any) => {
        this.router.navigate(['/empresa-list']);
      },
      (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = 'Error al registrar empresa. Intente nuevamente.';
      }
    );
  }

  onRucSelectionChange(event: any): void {
    if (!event.value) {
      this.empresa.EmpresaRuc = '';
    }
  }
}
