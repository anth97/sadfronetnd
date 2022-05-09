import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import Swal from 'sweetalert2';
import { PredioService } from '../../predio/services/predio.service';
import {Router } from '@angular/router';
import { DatatableComponent, ColumnMode} from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformacionComponent } from '../informacion/informacion.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-a-demanda',
  templateUrl: './a-demanda.component.html',
  styleUrls: ['./a-demanda.component.sass']
})
export class ADemandaComponent implements OnInit {

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
  checked = false;
  filteredData = [];
  data = [];
  register: FormGroup;
  public predioTipo: string="";

  @ViewChild('table') table: DatatableComponent;
  constructor(private predioService: PredioService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    ) { 
      

    
  }
  
  getRowHeight(row) {
    return row.height;
  }
  
  ngOnInit(): void {
    this.listTablaFiscalizacion()

    this.register= this.fb.group({
      cod_predio: ['', [Validators.required]],
      // condicion_predio: ['', [Validators.required,Validators.maxLength(30)]],
      tipo_predio: ['', [Validators.required]],
      ordenar_por: ["",[Validators.required]],      
      ref_direccion: ['', [Validators.required]],
      numero_lote: ["",[Validators.required]],
      manzana: ['', [Validators.required]],
      
      
    })

    this.fetch((data) => {
      this.data = data;
      this.filteredData = data;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 500);
    });
    // this.getListPrediosFiscalizacionFiscalizacionFiscalizacion("1");
    this.setPage({ offset: 0 });
  }
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/adv-tbl-data.json');
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
    req.send();
  }
 setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getListPrediosFiscalizacion(this.page.pageNumber+1)
    // console.log(pageInfo)
    // this.predioService.getResults(this.page).subscribe(pagedData => {
    //   this.page = pagedData.page;
    //   this.rows = pagedData.data;
    // });
  }
  columns = [
    { name: 'N°' },
    { name: 'Fecha' },
    { name: 'Tipo Predio' },  
    { name: 'Dirección / Referencia' },
    { name: 'Contribuyente' },
    { name: 'Prioridad' },
    { name: 'Acción' },
  ];
lstpredios=[]
tablaPrioridad = [];
load = false;
indice =0;
length = 0;
cod_predio: String = "";
editing = {};

  getListPrediosFiscalizacion(pagina){
    this.indice =+pagina*10;  
    
    // console.log(pagina)  
    // console.log(this.indice)
    this.load=true;
    this.loadingIndicator=true;
    this.predioService.getListPrediosFiscalizacion(pagina).subscribe((data: any) => {
      for(let i =0;i<data.results.length;i++){
        data.results[i].checked=false;
      }
      this.rows=data.results
    
      if(pagina==1){
        this.page.totalElements = data.count;
        this.page.totalPages = data.count/10;
        this.load=false;
        
      }
      this.loadingIndicator=false;
      
    }, err => console.log(err));
  }
  searchPredioFiscalizacion() {
    let filter: String =`ordering=${this.register.get("ordenar_por").value}&predio__cod_naturaleza_predio=${this.register.get("tipo_predio").value}&predio__cod_predio=${this.register.get("cod_predio").value}&predio__prediourbano__manzana=${this.register.get("manzana").value}&predio__prediourbano__lote=${this.register.get("numero_lote").value}&predio__ref_direccion=${this.register.get("ref_direccion").value}`
    this.predioService.searchPredioFiscalizacion(filter).subscribe((data: any) => {
      this.rows=data.results
      // if(pagina==1){
        this.page.totalElements = data.count;
        this.page.totalPages = data.count/10;
        this.load=false;
        
      
      this.loadingIndicator=false;
      
    }, err => console.log(err));
  }
  filterDatatable(event) {
    // get the value of the key pressed and make it lowercase
    const val = event.target.value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // assign filtered matches to the active datatable
    this.data = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (
          item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 ||
          !val
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }

  listTablaFiscalizacion (){
     
    this.predioService.listTablaFiscalizacion('040').subscribe(tablas => this.tablaPrioridad = tablas);
    
  }
  onChangePrioridad($event,id,rowIndex){
    console.log($event)
    let usuario = localStorage.getItem("user");
    let usuarioJson = JSON.parse(usuario);
    let data={
      predio: id,cod_prioridad_fiscalizacion : $event.target.value,user_reg:usuarioJson.id,user_mod:usuarioJson.id
    
    }
    console.log(data)
    this.predioService.getCrearPredioFiscalizacion(data).subscribe(data=>{
      this.rows[rowIndex].checked= true
    })
    
  }
  

  onChangeswitch($event){
    console.log($event.target)

  }

}

