import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AvatarComponent } from '../advanced-component/avatar/avatar.component';
import { CardComponent } from '../advanced-component/card/card.component';
import { SweetAlertComponent } from '../advanced-component/sweet-alert/sweet-alert.component';
import { ToastComponent } from '../advanced-component/toast/toast.component';

import { AdvancedComponentRoutingModule } from './advanced-component-routing.module';

@NgModule({
  declarations: [
    AvatarComponent,
    CardComponent,
    SweetAlertComponent,
    ToastComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    AdvancedComponentRoutingModule,
    ToastrModule.forRoot(),
  ],
})
export class AdvancedComponentModule {}
