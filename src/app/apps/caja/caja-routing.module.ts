import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrarCajaComponent } from './administrar-caja/administrar-caja.component';
import { AdministrarBovedaComponent } from './administrar-boveda/administrar-boveda.component';
import { CerrarCajaComponent } from './administrar-caja/cierre-caja/cierre-caja.component'
const routes: Routes = [
    {
        path: 'administrar-caja',
        component: AdministrarCajaComponent
    },
    {
        path: 'administrar-boveda',
        component: AdministrarBovedaComponent
    },
    {
        path: 'cierre-caja',
        component: CerrarCajaComponent
    }
  /* {
    path: 'registro-persona-natural',
    component: RegistroPersonaNaturalComponent,
  },
  {
    path: 'registro-persona-juridica',
    component: RegistroPersonaJuridicaComponent,
  }, */
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }
