import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvatarComponent } from './avatar/avatar.component';
import { CardComponent } from './card/card.component';
import { SweetAlertComponent } from './sweet-alert/sweet-alert.component';
import { ToastComponent } from './toast/toast.component';

const routes: Routes = [
  {
    path: 'avatar',
    component: AvatarComponent,
  },
  {
    path: 'card',
    component: CardComponent,
  },
  {
    path: 'sweet-alert',
    component: SweetAlertComponent,
  },
  {
    path: 'toast',
    component: ToastComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancedComponentRoutingModule {}
