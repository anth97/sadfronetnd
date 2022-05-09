import {NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ADemandaComponent } from './a-demanda/a-demanda.component';
import { Component } from '@angular/core';
import { InformacionComponent } from './informacion/informacion.component';

const routes: Routes = [
  {
    path: 'demanda',
        component: ADemandaComponent
      },
  {
    path: 'informacion/:id',
        component: InformacionComponent
      },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiscalizacionRoutingModule { }
