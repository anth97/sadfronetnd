import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PredioAreaComun } from 'src/app/core/interfaces/predio/predioAreaComun.interface';
import { TablaMaestra } from 'src/app/core/interfaces/public/tabla-maestra.interface';
import { PredioAreaComunService } from 'src/app/core/service/predio/predio-area-comun.service';
import { PredioConstruccionService } from 'src/app/core/service/predio/predio-construccion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comun-acomun',
  templateUrl: './comun-acomun.component.html',
  styleUrls: ['./comun-acomun.component.sass']
})
export class ComunAcomunComponent implements OnInit {

  public results: Array<PredioAreaComun> = [];
  public tablas: Array<TablaMaestra> = [];
  public form: FormGroup
  public formSubmitted: boolean = false;

  public total: number;
  public loadSiguiente: boolean = false;

  public loadValues: boolean = false;
  public predioID: number = +localStorage.getItem('predio-urbano') || null;

  constructor(private router: Router,
    private predioAreaComunService: PredioAreaComunService,
    private predioConstruccionService: PredioConstruccionService,
    private formBuilder: FormBuilder,
    ) { 
      this.form = this.formBuilder.group({
        predio: [1],
        cod_tipo_bien_comun: ['', Validators.required],
        descripcion: ['', Validators.required],
        fec_inicio_vigencia: ['', Validators.required],
        antiguedad: ['',],
        num_piso: [null],//parse to int
        valor_bien_comun: [0],
        monto_valor_terreno: ['0'],
        monto_valor_const: ['0'],
        monto_valor_obra_comple: ['0'],
        user_reg: [100],
        user_mod: [100]
      });
      

    }

  ngOnInit(): void {
    this.listTM();
    this.CargarPredioAreaComun()
  }
  isPatch: boolean = false;
  idAreaComun: number;
  CargarPredioAreaComun(){
    this.predioAreaComunService.filterPredioAreaComun(this.predioID).subscribe(
      data => {
        if (data.results.length >0){
          this.idAreaComun = data.results[0].id;
          this.form.get('cod_tipo_bien_comun').setValue(data.results[0].cod_tipo_bien_comun)
          this.form.get('descripcion').setValue(data.results[0].descripcion)
          if (data.results[0].fec_inicio_vigencia !=null){
            this.form.get('fec_inicio_vigencia').setValue(data.results[0].fec_inicio_vigencia.slice(0,10)) //slice
          }
          this.form.get('antiguedad').setValue(data.results[0].antiguedad);
          this.form.get('num_piso').setValue(data.results[0].num_piso);
          this.isPatch = true;
        }

      }, er => {

      }
    )
  }


  get antiguedad() {
    let fecha = new Date(this.form.get('fec_inicio_vigencia').value);
    let fechaActual = new Date();
    let anios = fechaActual.getFullYear() - fecha.getFullYear();
    //console.log(anios);
    return anios
  }


  listTM() {
    this.predioConstruccionService.listTabla('025').subscribe(tablas => this.tablas = tablas, err => {
      console.log(err);      
      this.errorMessage('!No se pudo cargar la lista de tipos del bien!')
    });
    this.loadValues = true;
    this.predioAreaComunService.getValuesofBienComun({predio: this.predioID}).subscribe(
      data => {
        this.form.get('monto_valor_terreno').setValue(data.valor_terreno);
        this.form.get('monto_valor_const').setValue(data.valor_construccion);
        this.form.get('monto_valor_obra_comple').setValue(data.valor_obra_complementaria);
        this.form.get('valor_bien_comun').setValue(data.valor_terreno+data.valor_construccion+data.valor_obra_complementaria);
        this.loadValues = false;
      },
      err => {
        this.loadValues = false;
        this.errorMessage()
      }
    );
  }

  errorMessage(mensaje = "Error inesperado en el servidor."){
    Swal.fire({
      icon: 'error',
      text: mensaje,
      footer: 'Pongase en contacto con el administrador'
    });
  }

  InputNumber(evt){
    //verifica el tamaño maximo del imput y ya no le permite ingresar mas.
    var ch = String.fromCharCode(evt.which);  
    
    //patern for integer number
    if(!(/^\d*/.test(ch))){
        evt.preventDefault();
    }    
  }

  save() {
    this.loadSiguiente = true;
    this.form.value['antiguedad'] = this.antiguedad
    this.form.value['predio'] = this.predioID;
    this.form.value['user_reg'] = JSON.parse(localStorage.getItem("user")).id
    this.form.value['user_mod'] = JSON.parse(localStorage.getItem("user")).id
    //console.log( new Date(this.form.value['fe_inicio_vigencia']).toISOString());
    this.form.markAllAsTouched();
    if (this.predioID===null){
      this.loadSiguiente = false;
      this.errorMessage("No existe el predio para asignarle el bien común.")
      return;
    }
    if (this.form.invalid) {
      this.loadSiguiente = false;
      return;
    }
    console.log(this.form.value);
    if (this.isPatch){
      this.predioAreaComunService.editPredioAreaComun(this.idAreaComun.toString(), this.form.value).subscribe(
        data => {          
          localStorage.setItem("compartido", data.id.toString())
          this.updatePredio(0);
        }, err => {
          console.log(err);
          this.loadSiguiente = false;
          this.errorMessage("No se pudo actualizar el predio bien común intente más tarde.")
        }
      );

    }else {
      this.predioAreaComunService.createPredioBienComun(this.form.value).subscribe(results => {
        this.loadSiguiente = false;
        localStorage.setItem("compartido", results.id.toString())
        this.updatePredio(0);
      }, err => {
        console.log(err);
        this.loadSiguiente = false;
        this.errorMessage("No se pudo crear el predio bien común intente más tarde.")
      });
    }
  }

  updatePredio(num: number) {
    let data = {
      'progreso_registro': num,
    }
    this.predioConstruccionService.updatePredio(this.predioID.toString(), data).subscribe(results => {
      if (num == 0) {
        this.loadSiguiente = false;  
        this.router.navigateByUrl('/predio/copropietario');    
      } else if (num == 3) {
        this.router.navigateByUrl('/predio/complements?from=biencomun');
      }

    }, err => {
      this.errorMessage();
    })
  }


}

