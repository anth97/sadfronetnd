import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TablesRoutingModule } from './tables-routing.module';
import { BasicTableComponent } from './basic-table/basic-table.component';
import { AdvanceTableComponent } from './advance-table/advance-table.component';

@NgModule({
  declarations: [BasicTableComponent, AdvanceTableComponent],
  imports: [CommonModule, TablesRoutingModule, NgbModule],
})
export class TablesModule {}
