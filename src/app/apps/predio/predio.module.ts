import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PredioRoutingModule } from './predio-routing.module';
import { ConstruccionComponent } from './construccion/construccion.component';
import { CreateNuevoUrbanoComponent } from './create-nuevo-urbano/create-nuevo-urbano.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArchwizardModule } from 'angular-archwizard';
import { ConstruccionModalComponent } from './construccion/construccion-modal/construccion-modal.component';
import { AComunComponent } from './acomun/acomun.component';

import { ComplementosComponent } from './complementos/complementos.component';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NuevoRusticoComponent } from './nuevo-rustico/nuevo-rustico.component';

import { NgxMaskModule } from 'ngx-mask';

import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { CustomFormsModule } from 'ngx-custom-validators';
import { PropietarioComponent } from './propietario/propietario.component';
import { RegistroPersonaNaturalComponent } from '../contribuyente/registro-persona-natural/registro-persona-natural.component';
import { RegistroPersonaJuridicaComponent } from '../contribuyente/registro-persona-juridica/registro-persona-juridica.component';
import { ContribuyenteModule } from '../contribuyente/contribuyente.module';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AcomunModalComponent } from './acomun/acomun-modal/acomun-modal.component';
import { ComplementosModalComponent } from './complementos/complementos-modal/complementos-modal.component';
import { EnProcesoComponent } from './en-proceso/en-proceso.component';
import { ComunAcomunComponent } from './comun-acomun/comun-acomun.component';
import { CopropietarioComponent } from './copropietario/copropietario.component';


@NgModule({
  declarations: [
    ConstruccionComponent,
    ConstruccionModalComponent,
    AComunComponent,
    ComplementosComponent,
    CreateNuevoUrbanoComponent,
    NuevoRusticoComponent,
    ComplementosComponent,
    PropietarioComponent,
    BusquedaComponent,
    AcomunModalComponent,
    ComplementosModalComponent,
    EnProcesoComponent,
    ComunAcomunComponent,
    CopropietarioComponent,
  ],
  imports: [
    CommonModule,
    PredioRoutingModule,
    FormsModule,
    ReactiveFormsModule,  
    ArchwizardModule,
    NgxDatatableModule,
    ContribuyenteModule,
    MatDialogModule
    ]
})
export class PredioModule { }
