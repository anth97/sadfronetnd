import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiscalizacionRoutingModule } from './fiscalizacion-routing.module';
import { ADemandaComponent } from './a-demanda/a-demanda.component';
import { InformacionComponent } from './informacion/informacion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  declarations: [
    ADemandaComponent,
    InformacionComponent,   
  ],
  imports: [
    CommonModule,
    FiscalizacionRoutingModule,
    NgbModule,
    NgSelectModule,
    NgbNavModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgxDatatableModule,
    MatSlideToggleModule,
  
  ]
})
export class FiscalizacionModule { }
