import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ContribuyenteRoutingModule } from './contribuyente-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RegistroPersonaNaturalComponent } from './registro-persona-natural/registro-persona-natural.component';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RegistroPersonaJuridicaComponent } from './registro-persona-juridica/registro-persona-juridica.component';

@NgModule({
  declarations: [RegistroPersonaNaturalComponent, RegistroPersonaJuridicaComponent],
  imports: [
    ContribuyenteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    ArchwizardModule,
    NgxDatatableModule,
    CommonModule
  ], 
  providers:[
    DatePipe,
  ],
  exports: [
    RegistroPersonaNaturalComponent, RegistroPersonaJuridicaComponent
  ]
})
export class ContribuyenteModule { }
