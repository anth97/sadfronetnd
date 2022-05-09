import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { IconsRoutingModule } from './icons-routing.module';
import { FontAwesomeComponent } from './font-awesome/font-awesome.component';
import { MaterialIconsComponent } from './material-icons/material-icons.component';
import { FeatherIconsComponent } from './feather-icons/feather-icons.component';

@NgModule({
  declarations: [
    FontAwesomeComponent,
    MaterialIconsComponent,
    FeatherIconsComponent,
  ],
  imports: [CommonModule, IconsRoutingModule, FeatherModule.pick(allIcons)],
  exports: [FeatherModule],
})
export class IconsModule {}
