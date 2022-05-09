import { FontAwesomeComponent } from './font-awesome/font-awesome.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialIconsComponent } from './material-icons/material-icons.component';
import { FeatherIconsComponent } from './feather-icons/feather-icons.component';

const routes: Routes = [
  {
    path: 'material',
    component: MaterialIconsComponent,
  },
  {
    path: 'font-awesome',
    component: FontAwesomeComponent,
  },
  {
    path: 'feather',
    component: FeatherIconsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IconsRoutingModule {}
