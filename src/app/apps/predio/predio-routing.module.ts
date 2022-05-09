import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AComunComponent } from './acomun/acomun.component';
import { ConstruccionModalComponent } from './construccion/construccion-modal/construccion-modal.component';
import { ConstruccionComponent } from './construccion/construccion.component';
import { ComplementosComponent } from './complementos/complementos.component';
import { CreateNuevoUrbanoComponent } from './create-nuevo-urbano/create-nuevo-urbano.component';
import { NuevoRusticoComponent } from './nuevo-rustico/nuevo-rustico.component';
import { PropietarioComponent } from './propietario/propietario.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { EnProcesoComponent } from './en-proceso/en-proceso.component';
import { ComunAcomunComponent } from './comun-acomun/comun-acomun.component';
import { CopropietarioComponent } from './copropietario/copropietario.component';

const routes: Routes = [
  {
    path: 'const',
    component: ConstruccionComponent
  },
  {
    path: 'comun',
    component: AComunComponent
  },
  {
    path: 'complements',
    component: ComplementosComponent
  },
  {
    path: 'biencomunacomun',
    component: ComunAcomunComponent
  },
  {
    path: 'copropietario',
    component: CopropietarioComponent
  },
  {
    path: 'urbano',
    component: CreateNuevoUrbanoComponent
  },
  {
    path: 'nuevourbano',
    component: CreateNuevoUrbanoComponent
  },
  {
    path: 'nuevo_bien_comun',
    component: CreateNuevoUrbanoComponent
  },
  {
    path: 'biencomun',
    component: CreateNuevoUrbanoComponent
  },
  {
    path: 'rustico',
    component: NuevoRusticoComponent
  },
  {
    path: 'propietario',
    component: PropietarioComponent
  },
  {
    path: 'busqueda',
    component: BusquedaComponent
  },
  {
    path: 'proceso',
    component: EnProcesoComponent
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PredioRoutingModule { }
