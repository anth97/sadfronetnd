import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RowDetailsComponent } from './row-details/row-details.component';
import { FilterComponent } from './filter/filter.component';
import { EditingComponent } from './editing/editing.component';
import { BasicDatatableComponent } from './basic-datatable/basic-datatable.component';
import { SelectionComponent } from './selection/selection.component';
import { PinningComponent } from './pinning/pinning.component';

const routes: Routes = [
  {
    path: 'basic',
    component: BasicDatatableComponent,
  },
  {
    path: 'editing',
    component: EditingComponent,
  },
  {
    path: 'filter',
    component: FilterComponent,
  },
  {
    path: 'row-details',
    component: RowDetailsComponent,
  },
  {
    path: 'pinning',
    component: PinningComponent,
  },
  {
    path: 'selection',
    component: SelectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataTablesRoutingModule {}
