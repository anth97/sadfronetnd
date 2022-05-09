import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import Swal from 'sweetalert2';
import { PredioService } from './../services/predio.service';
import {Router } from '@angular/router';
import { DatatableComponent, ColumnMode} from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-en-proceso',
  templateUrl: './en-proceso.component.html',
  styleUrls: ['./en-proceso.component.sass']
})
export class EnProcesoComponent implements OnInit {
  
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


  @ViewChild('table') table: DatatableComponent;
  constructor(private predioService: PredioService,
    private router: Router,
    ) { 
      

    
  }
  
  getRowHeight(row) {
    return row.height;
  }
  
  ngOnInit(): void {
    // this.getListPredios("1");
    this.setPage({ offset: 0 });
  }
 setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getListPredios(this.page.pageNumber+1)
    // console.log(pageInfo)
    // this.predioService.getResults(this.page).subscribe(pagedData => {
    //   this.page = pagedData.page;
    //   this.rows = pagedData.data;
    // });
  }

lstpredios=[]
load = false;
indice =0;
  getListPredios(pagina){
    this.indice =+pagina*10;  
    
    // console.log(pagina)  
    // console.log(this.indice)
    this.load=true;
    this.loadingIndicator=true;
    this.predioService.getListPredios(pagina).subscribe((data: any) => {
      this.rows=data.results
      if(pagina==1){
        this.page.totalElements = data.count;
        this.page.totalPages = data.count/10;
        this.load=false;
        
      }
      this.loadingIndicator=false;
      
    }, err => console.log(err));
  }

  delete(id: string){
    Swal.fire({
      title: 'Estas seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((res)=>{
      if(res.value){
        this.predioService.delete(id).subscribe(results => {
          this.lstpredios=[]
          this.getListPredios(this.page.pageNumber+1);
         
          Swal.fire({
            icon: 'success',
            title: 'Éxito...',
            text: 'Registro En Proceso eliminado correctamente!',
              
          });  
        })
      }
    }) 
  }

  edit(item:any){
    if(item.prediourbano){
      localStorage.setItem('predio-urbano',item.id.toString())
      localStorage.setItem("region", item.cod_region_peru) 
      if (item.progreso_registro == 1){
        this.router.navigateByUrl('/predio/urbano')
      } else if(item.progreso_registro == 2){
        this.router.navigateByUrl('/predio/const')
      }else if(item.progreso_registro == 3){
      this.router.navigateByUrl('/predio/complements')
      }else if(item.progreso_registro == 4){
        this.router.navigateByUrl('/predio/comun')
      }
    }
    else if(item.prediorustico) {
      localStorage.setItem('predio-rustico',item.id.toString())
      if (item.progreso_registro == 1){
        this.router.navigateByUrl('/predio/rustico')
      } 

    }else{
      Swal.fire({
        icon: 'warning',
        title: 'Ruta no encontrada...',
        text: 'No Se encontro el Progreso del Predio',
          
      });  
    }
    
      
  }

}
