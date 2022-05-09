import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PredioComplementos } from 'src/app/core/interfaces/predio/predioComplements.interface';
import { PredioComplementsService } from '../../../../core/service/predio/predio-complements.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TablaMaestra } from 'src/app/core/interfaces/public/tabla-maestra.interface';


@Component({
  selector: 'app-complementos-modal',
  templateUrl: './complementos-modal.component.html',
  styleUrls: ['./complementos-modal.component.sass']
})
export class ComplementosModalComponent implements OnInit {

  public selected: string;
  public form: FormGroup
  public formSubmitted: boolean = false;

  public results: Array<PredioComplementos> = [];
  //public id: string
  lsEstrucPre = []; //lista estructura predeminante
  lstEstadoConser = []; //lista estado conservación
  lstClasificacion = []; 
  lstUnidadMedida = [];
  lstEstadoConstrucc = [];
  

  lstPredioComplementos = [];
  public total:number;
  public status = this.data['tipo'];
  public isDisabled: boolean = false;
  private condicionPattern: any = /^[0-9]{1,12}([.][0-9]{1,2})?$/




  constructor(
    private predioComplementService: PredioComplementsService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<ComplementosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {

    this.load(this.data['predio']['id'])

    if (this.status == 'view'){
      this.isDisabled = true;
    }
    this.list()
    this.getClasificacion();
    this.getEstadoConserva();
    this.getEstadoConstruc();
    this.getEstructuraPredo();
    this.getUnidadMedida();
    
    

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
      usuario_mod: [JSON.parse(localStorage.getItem("user")).id],
      
      

      
    });

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

  InputNumber(evt){
                
    var ch = String.fromCharCode(evt.which);
    
    if(!(/^\d*\.?\d*$/.test(ch))){
        evt.preventDefault();
    }
    
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
      this.lstUnidadMedida = data;
    }, err => console.log(err));
  }

  getClasificacion(){
    this.predioComplementService.getClasificacion().subscribe((data: any) => {
      this.lstClasificacion = data;
    }, err => console.log(err));

  }

  


  update(){    
    this.form.value['antiguedad'] = this.antiguedad
    this.form.markAllAsTouched();
    if(this.form.invalid){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal!',
      });
      return;
    }
    this.predioComplementService.updatePredioComplementos(this.selected, this.form.value).subscribe(res=>{
      Swal.fire({
        text: 'Se ',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#43C05B',
      });
      this.list()
      this.dialogRef.close();
    })
  }
  
  cancel(){
    this.dialogRef.close();
  }

  load(id: string) {        
    this.selected = id;
    return this.predioComplementService.getPredioById(id).subscribe(predio => this.form.patchValue(predio));    
  }

  list() {
    let id = localStorage.getItem('predio-urbano')
    this.predioComplementService.list(id).subscribe(results => this.results = results);
  }

  
  

  

  

}
