import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PredioService } from '../../predio/services/predio.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { DatatableComponent, ColumnMode} from '@swimlane/ngx-datatable';
import { PersonaNaturalService } from 'src/app/core/service/contribuyente/contribuyente-persona-natural.service';
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.sass']
})
export class InformacionComponent implements OnInit {
  rows = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;
  page = {
    size: 10,
  // The total number of elements
  totalElements: 0,
  // The total number of pages
  totalPages: 0,
  // The current page number
  pageNumber: 0,
  };
  ColumnMode = ColumnMode;

  filteredData = [];
  lsttipovia = [];
  lsttipozona = [ ];
  tablaPrioridad = [];
  lstDepartamentos = [];
  lstProvincias = [];
  lstDistritos = [];

  form: FormGroup;
  public selected: string;
  
  public formSubmitted: boolean = false;

  @ViewChild('table') table: DatatableComponent;
  constructor(private fb: FormBuilder,
    private predioService : PredioService,
    private personaNaturalService : PersonaNaturalService,
    private _Activatedroute:ActivatedRoute) {
      this.id=this._Activatedroute.snapshot.paramMap.get("id");
    
   }
  total=0;
  active;
  data :any;
  cantidad;
  id;
  
  
  ngOnInit(): void {
    this.cagarData(this.id)
    this.listTablaFiscalizacion()

  
    this.getTipoZonas();
  }
  getTipoZonas(){
    this.predioService.getTipoZona().subscribe((data: any) => {
      this.lsttipozona = data;
    }, err => console.log(err));
  }

  cagarData(id: string){
    this.predioService.getPredioFiszalizacionById(id).subscribe((data:any)=>{
    this.data=data
    

    })

  }
  listTablaFiscalizacion (){
     
    this.predioService.listTablaFiscalizacion('040').subscribe(tablas => this.tablaPrioridad = tablas);
    
  }
 

  load(id: string) {        
    this.selected = id;
    return this.predioService.getListPrediosFiscalizacion(id).subscribe(predio => this.form.patchValue(predio));    
  }
  onChangePrioridad(){

  }

  getDepartamentos() {
    this.personaNaturalService.getDepartamentos().subscribe(
      (data: any) => {
        this.lstDepartamentos = data.results;
      },
      (err) => console.log(err)
    );
  }
  getProvinciasInfo(codigo_depart:string) {
    //this.form.controls["codigo_depart"].value.codigo_depart
    
    this.personaNaturalService.getProvinciasInfo(codigo_depart).subscribe(
      (data: any) => {
        this.lstProvincias = data.results;
      },
      (err) => console.log(err)
    );
  }

  getDistritosInfo(codigo_depart:string, codigo_prov:string) {
    //this.form.controls["codigo_depart"].value.codigo_depart
    //this.form.controls["codigo_prov"].value.codigo_prov
    
    this.personaNaturalService.getDistritosInfo(codigo_depart,codigo_prov ).subscribe(
      (data: any) => {
        this.lstDistritos = data.results;
      },
      (err) => console.log(err)
    );
  }
}
