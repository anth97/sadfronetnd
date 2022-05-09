import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { PredioComplementsService } from '../../../core/service/predio/predio-complements.service';
import { ActivatedRoute, Router } from '@angular/router';


import { MatDialog } from '@angular/material/dialog';
import { ComplementosModalComponent } from './complementos-modal/complementos-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-complementos',
  templateUrl: './complementos.component.html',
  styleUrls: ['./complementos.component.sass']
})
export class ComplementosComponent  {

  lstDirec: any[];
  lstvia=[];
  direccion= "hola";

  lsEstrucPre = []; //lista estructura predeminante
  lstEstadoConser = []; //lista estado conservación
  lstClasificacion = [];

  lstUnidadMedida = [];
  lstDistancia = []; 
  lstCapacidad = [];
  lstAbrevia = [];
  lstEstadoConstrucc = []; //lista estado de construcción

  lstPredioComplementos = [];

  public total:number

  public form: FormGroup
  public formSubmitted: boolean = false;
  hide = true;
  private condicionPattern: any = /^[0-9]{1,12}([.][0-9]{1,2})?$/

  public isFromBienComun: boolean = false;
  

  constructor(
    private predioComplementService: PredioComplementsService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,
    ) {
      this.initForm();
      this.activateRoute.queryParams.subscribe((params) => {
        console.log(params); // { from: "biencomun" }  
        if (params["from"] === "biencomun") {
          this.isFromBienComun = true;
        }
      });
      this.cargarDataPredio();
      this.getDireccion();
      this.getTipoVias();
      
      
    
    
  }
  IDPredio: string;
  errorGetPredio: string;

  load: boolean = false;

  cargarDataPredio(){
    const predio= localStorage.getItem('predio-urbano')
    if(predio==undefined){
      this.router.navigate(['predio/urbano'])
    }
    this.predioComplementService.getComplemento(predio).subscribe((data:any)=>{
      this.lstPredioComplementos = data.results;
      
      
    }, err => {
      console.log(err);
      //this.router.navigate(['predio/urbano'])
      //msg for servidor no disponible.
      this.form.disable();
      
    })
  }

  initForm() {
    this.form = this.fb.group({
      cod_clasificacion_obra_complementaria:["",Validators.required],
      cod_estado_conservacion:["",Validators.required],
      cod_estructura_predominante:["",Validators.required],
      cod_estado_construccion:["",Validators.required],
      cod_unidad_medida:['',Validators.required],
      
      fec_inicio_vigencia:['',Validators.required],
      
      descripcion:["",[Validators.required,Validators.maxLength(150)]],

      antiguedad:[""],

      metrado:["",[Validators.required,Validators.min(0),Validators.pattern(this.condicionPattern)]],
      
      largo:["",[Validators.required,Validators.min(0),Validators.pattern(this.condicionPattern)]],
      ancho:["",[Validators.required,Validators.min(0),Validators.pattern(this.condicionPattern)]],
      alto:["",[Validators.required,Validators.min(0),Validators.pattern(this.condicionPattern)]],
      valor_unitario:["",[Validators.required,Validators.min(0),Validators.pattern(this.condicionPattern)]],
      porcent_depreciado:["",[Validators.required,Validators.min(0),Validators.pattern(/^[0-9]{1,3}([.][0-9]{1,2})?$/)]],


      valor_depreciado:[""],
      valor_construccion:[""],
      
      

      
    });
    

  }

  ngOnInit(): void {
    this.initForm();
    
    this.getClasificacion();
    this.getEstadoConserva();
    this.getEstadoConstruc();
    this.getEstructuraPredo();
    this.getUnidadMedida();
    

    
    this.form.controls["cod_unidad_medida"].disable();
    
    
    
  }

  get antiguedad(){
    let fecha = new Date(this.form.get('fec_inicio_vigencia').value);
    let fechaActual = new Date();
    let antiguedad = fechaActual.getFullYear() - fecha.getFullYear();
    return antiguedad
  }

  get Depreciacion(){
    
    //let valor_depreciado = valor_unitario*(porcent_depreciado/100)
    let valor_depreciado = (Number(this.form.get("valor_unitario").value)*(Number(this.form.get("porcent_depreciado").value)/100)).toFixed(2);
    return valor_depreciado
  }

  get Construccion(){
    
    //let valor_construccion = (valor_unitario - valor_depreciado)*metrado
    let valor_construccion = ((Number(this.form.get("valor_unitario").value)-Number(this.Depreciacion))*Number(this.form.get("metrado").value)).toFixed(2);
    return valor_construccion
    
  }

  valorTotal(){
    this.total=0
    this.lstPredioComplementos.forEach(e => {    
      this.total += Number(e.valor_construccion);      
    });
    return this.total.toFixed(2)
  }

  InputNumber(evt){
                
    var ch = String.fromCharCode(evt.which);
    
    if(!(/^\d*\.?\d*$/.test(ch))){
        evt.preventDefault();
    }
    
  }

  onChangeMedida(){
    this.form.controls["cod_unidad_medida"].enable();
    console.log(this.form.controls["cod_clasificacion_obra_complementaria"].value)
    if(this.form.controls["cod_clasificacion_obra_complementaria"].value=="004004" 
    ||this.form.controls["cod_clasificacion_obra_complementaria"].value=="004003"){
      this.lstUnidadMedida=this.lstCapacidad;
      console.log(this.lstCapacidad)

    }else{
      this.lstUnidadMedida=this.lstDistancia;
    }

    
  }
  
  onRegister() {
    console.log('Form Value', this.form .value);
  }

  getDireccion(){
    let id = localStorage.getItem('predio-urbano')
    this.predioComplementService.getDireccion(id).subscribe((data: any[]) => {

      
      this.lstDirec = data;
      
    }, err => console.log(err))

    
  }

  getTipoVias(){
    this.predioComplementService.getTipoVia().subscribe((data: any) => {
      this.lstvia = data;

    }, err => console.log(err));
  }


  getEstructuraPredo(){
    this.predioComplementService.getEstructPredominant().subscribe((data: any) => {
      this.lsEstrucPre = data;
    }, err => console.log(err));
  }

  getEstadoConserva(){
    this.predioComplementService.getEstadoConserva().subscribe((data: any) => {
      this.lstEstadoConser = data;
    }, err => console.log(err));
  }

  getEstadoConstruc(){
    this.predioComplementService.getEstadoConstruc().subscribe((data: any) => {
      this.lstEstadoConstrucc = data;
    }, err => console.log(err));
  }

  getUnidadMedida(){
    this.predioComplementService.getUnidadMedidad().subscribe((data: any) => {
      this.lstDistancia = [data[0],data[1],data[2],data[6],data[7]];
      this.lstCapacidad = [data[3],data[4],data[5],data[7]]; 
      this.lstAbrevia = data;
      
    }, err => console.log(err));
  }


  getClasificacion(){
    this.predioComplementService.getClasificacion().subscribe((data: any) => {
      this.lstClasificacion = data;
    }, err => console.log(err));

  }

  

  errorForm
  ccSiguiente=false;

  clickA(cons: any, tipo: string){
    const dialogRef = this.dialog.open(ComplementosModalComponent, {
      width: '70%',
      height: '540px',
      data: {predio: cons, tipo: tipo}      
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('asdasd');
    })
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
        this.predioComplementService.delete(id).subscribe(results => {
          this.cargarDataPredio()
          Swal.fire({
            icon: 'success',
            title: 'Éxito...',
            text: 'Registro eliminado correctamente!',
          });  
        })
      }
    })    
  }
  

  save(){
    
    this.errorGetPredio = undefined;
    this.ccSiguiente = true;
    this.formSubmitted = true;
    if (!this.form.valid) {
      console.log('error');
    }
    this.load = true;
    let predioComplements={
      cod_clasificacion_obra_complementaria: this.form.get('cod_clasificacion_obra_complementaria').value,
      cod_estado_conservacion: this.form.get('cod_estado_conservacion').value,
      cod_estructura_predominante: this.form.get('cod_estructura_predominante').value,
      cod_estado_construccion: this.form.get('cod_estado_construccion').value,
      fec_inicio_vigencia: this.form.get('fec_inicio_vigencia').value,
      descripcion: this.form.get('descripcion').value,
      antiguedad: this.antiguedad,
      metrado: this.getTwoDecimals(this.form.get('metrado').value),
      cod_unidad_medida: this.form.get('cod_unidad_medida').value,
      largo:this.getTwoDecimals(this.form.get('largo').value),
      ancho: this.getTwoDecimals(this.form.get('ancho').value),
      alto: this.getTwoDecimals(this.form.get('alto').value),
      valor_unitario: this.getTwoDecimals(this.form.get('valor_unitario').value),
      porcent_depreciado:this.getTwoDecimals( this.form.get('porcent_depreciado').value),
      valor_depreciado: this.Depreciacion,
      valor_construccion:this.Construccion,
      predio: localStorage.getItem('predio-urbano'),
      usuario_reg: JSON.parse(localStorage.getItem("user")).id,
      usuario_mod: JSON.parse(localStorage.getItem("user")).id,
      
    }
    

     
    this.predioComplementService.createPredioComplementos(predioComplements).subscribe((data:any)=>{
      Swal.fire({
        text: 'La obra complementaria fue agregada',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#43C05B',
      });
        this.load =false;
        this.lstPredioComplementos.push(data)
        
        
        this.form.reset();                               
        
      }, err => {console.log(err);
        this.load = false;
        this.errorGetPredio = "No se pudo crear el predio";
        window.scroll(0,0);
      });

    
    
  }

  private getTwoDecimals(value: Number | null): Number | null {
    if (value==null){
      return value;
    }
    if (typeof(value)=='string'){
      value = +value;
    }
    
    return +value.toFixed(2)
  }

  abrevia(value){
    
    let abreviaturas;
    for(let i in this.lstAbrevia){
      if(value == this.lstAbrevia[i].codigo){
        abreviaturas =  this.lstAbrevia[i].abreviatura;
        break;
      }

    }
    return abreviaturas;
  }

  via(value){
    let direccion;
    console.log(this.lstvia)
    for(let via of this.lstvia){   
      if(value==via.codigo){
        direccion=via.abreviatura;
        break;
      }
    }
    return direccion;
  }
  
  updatePredio(num: number) {
    let id = localStorage.getItem('predio-urbano')
    let data = {
      'progreso_registro': num,
    }
    
      if (num == 1) {
        this.router.navigateByUrl('/predio/urbano')
      } else if (num == 2) {
        this.router.navigateByUrl('/predio/complements')
      }

    
  }

  navegar(value){
    //make update progreso registro
    if(value==2){
      if (this.isFromBienComun){
        this.router.navigateByUrl('/predio/const?from=biencomun');
      }else {
        this.router.navigateByUrl('/predio/const');
      }
    }else if(value==4){
      if (this.isFromBienComun){
        this.router.navigateByUrl('/predio/biencomunacomun');
      } else {
        this.router.navigateByUrl('/predio/comun');
      }
    }

  }
 

}
