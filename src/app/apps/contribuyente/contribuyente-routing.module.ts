import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPersonaNaturalComponent } from './registro-persona-natural/registro-persona-natural.component';
import { RegistroPersonaJuridicaComponent } from './registro-persona-juridica/registro-persona-juridica.component';
const routes: Routes = [
  {
    path: 'registro-persona-natural',
    component: RegistroPersonaNaturalComponent,
  },
  {
    path: 'registro-persona-juridica',
    component: RegistroPersonaJuridicaComponent,
  },
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContribuyenteRoutingModule { }
