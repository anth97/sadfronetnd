import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { CajaRoutingModule } from './caja-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AdministrarCajaComponent } from './administrar-caja/administrar-caja.component';
import { AdministrarBovedaComponent } from './administrar-boveda/administrar-boveda.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BovedaModalComponent } from './administrar-boveda/boveda-modal/boveda-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CajaModalComponent } from './administrar-caja/caja-modal/caja-modal.component';
import { CerrarCajaComponent } from './administrar-caja/cierre-caja/cierre-caja.component'


@NgModule({
  declarations: [
    AdministrarCajaComponent, AdministrarBovedaComponent, BovedaModalComponent, 
    CajaModalComponent, CerrarCajaComponent
  ],
  imports: [
    CajaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ArchwizardModule,
    NgxDatatableModule,
    CommonModule,
    NgbModule,
    MatDialogModule,
  ], 
  providers:[
    DatePipe,
  ],
  exports: [
    AdministrarCajaComponent, AdministrarBovedaComponent, CerrarCajaComponent
  ]
})
export class CajaModule { }
