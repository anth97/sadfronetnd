import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTablesRoutingModule } from './data-tables-routing.module';
import { BasicDatatableComponent } from './basic-datatable/basic-datatable.component';
import { EditingComponent } from './editing/editing.component';
import { FilterComponent } from './filter/filter.component';
import { RowDetailsComponent } from './row-details/row-details.component';
import { PinningComponent } from './pinning/pinning.component';
import { SelectionComponent } from './selection/selection.component';

@NgModule({
  declarations: [
    BasicDatatableComponent,
    EditingComponent,
    FilterComponent,
    RowDetailsComponent,
    PinningComponent,
    SelectionComponent,
  ],
  imports: [
    CommonModule,
    DataTablesRoutingModule,
    NgxDatatableModule,
    NgbModule,
  ],
})
export class DataTablesModule {}
