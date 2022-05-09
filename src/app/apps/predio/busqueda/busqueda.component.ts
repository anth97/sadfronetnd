import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.sass']
})


export class BusquedaComponent implements OnInit {

  public contribuyente: string ="";
  public predioTipo: string="";

  constructor() { }

  ngOnInit(): void {
  }

}
