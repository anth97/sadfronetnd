import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvanceTableComponent } from './advance-table/advance-table.component';
import { BasicTableComponent } from './basic-table/basic-table.component';

const routes: Routes = [
  {
    path: 'basic-tables',
    component: BasicTableComponent,
  },
  {
    path: 'advance-tables',
    component: AdvanceTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule {}
