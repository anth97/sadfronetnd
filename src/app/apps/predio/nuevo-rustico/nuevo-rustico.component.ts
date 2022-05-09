import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PredioService } from './../services/predio.service';

@Component({
  selector: 'app-nuevo-rustico',
  templateUrl: './nuevo-rustico.component.html',
  styleUrls: ['./nuevo-rustico.component.sass']
})
export class NuevoRusticoComponent {

  ubicacion: any[]; //Ayacucho/Huamanga/Ayacucho
  depart: any;
  prov: any;
  distri: any;
  private defaultSelect = 'AAAAAA'
  private condicionPattern: any = /^[0-9]{1,12}([.][0-9]{1,2})?$/

  public formSubmitted: boolean = false;
  
  isPatch: string | boolean = false; //verifica que no es una actualizacion

 
  lstcondicionpredio = [];

  lstcategoriaprediorustico = [];

  lstgrupoaltitud = [];

  lstgrupotierra = [];

  lstcodigotipoexplotacion = [];
  lstexplotacion = [];

  error: any;

  register: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder,
    private predioService: PredioService,
    private router: Router) {
    this.initForm();
    this.isPatch = localStorage.getItem("predio-rustico") || false;
    if (this.isPatch){
      this.cargarDataPredio();
    }
  }
  errorGetPredio: string;
  IDPREDIORUSTICO: string;

  load: boolean = false;
   
  cargarDataPredio(){
    this.predioService.getPredioRusticoById(this.isPatch).subscribe((data: any) => {
      this.register.get('codigo_catastral').setValue(data.cod_catastral);
      this.register.get('referencia').setValue(data.ref_direccion);
      this.IDPREDIORUSTICO = data.prediorustico.id.toString()
      // console.log(this.IDPREDIORUSTICO);
      this.register.get('codigo_catastral').setValue(data.predirustico.cod_catastral);
      this.register.get('condicion_predio').setValue(data.predirustico.condicion_predio);
      this.register.get('fecha_inicio').setValue(data.predirustico.fecha_inicio);
      this.register.get('area_del_terreno').setValue(data.predirustico.area_del_terreno);
      this.register.get('area_construida').setValue(data.predirustico.area_construida);
      this.register.get('referencia').setValue(data.predirustico.referencia);
      this.register.get('categoria_predio_rustico').setValue(data.predirustico.categoria_predio_rustico);
      this.register.get('grupo_altitud').setValue(data.predirustico.grupo_altitud);
      this.register.get('grupo_tierra').setValue(data.predirustico.grupo_tierra);
      this.register.get('codigo_tipo_explotacion').setValue(data.predirustico.codigo_tipo_explotacion);
      this.register.get('explotacion').setValue(data.predirustico.explotacion);
      this.register.get('explotacion1').setValue(data.predirustico.explotacion1);
      this.isPatch = true;
    }, err => {
      console.log(err);
      this.errorGetPredio="No existe este predio, intente crear uno nuevo"
      localStorage.removeItem("predio-rustico");
      this.isPatch = false;
    })
  }
  
  initForm() {
    this.register= this.fb.group({
      codigo_catastral: ['', [Validators.required,Validators.maxLength(20)]],
      // condicion_predio: ['', [Validators.required,Validators.maxLength(30)]],
      fecha_inicio: ['', [Validators.required]],
      area_del_terreno: ['',[Validators.required,Validators.min(0),Validators.pattern(this.condicionPattern)]],      
      area_construida: ['',[Validators.required,Validators.min(0),Validators.pattern(this.condicionPattern)]],      
      referencia: ['', [Validators.required,Validators.maxLength(200)]],
      categoria_predio_rustico: [this.defaultSelect, [Validators.required,Validators.pattern('[0-9]{6}')]],
      grupo_altitud: [this.defaultSelect, [Validators.required,Validators.pattern('[0-9]{6}')]],
      grupo_tierra: [this.defaultSelect, [Validators.required,Validators.pattern('[0-9]{6}')]],
      codigo_tipo_explotacion: [this.defaultSelect, [Validators.required,Validators.pattern('[0-9]{6}')]],
      explotacion: [this.defaultSelect, [Validators.required,Validators.pattern('[0-9]')]],
      explotacion1: ['',[Validators.required,Validators.min(0),Validators.pattern(/^[0-9]{1,3}([.][0-9]{1,2})?$/)]],
      
    })
  }
  
  onRegister() {
    console.log("querjkl")
    console.log(this.register.value);
  }
  ngOnInit(): void {
    this.initForm();
    this.getMaestras();
    this.getCategoriaPredioRustico();
    this.getExplotacion();
    this.getGrupoTierra();
    this.getGrupoAltitud();
    this.getCodigoTipoExplotacion();
    this.getUbigeos();
  }
  getUbigeos(){
    this.predioService.getUbigeo().subscribe((data: any[]) => {
      
      this.depart = data.find(ubigeo => {
        return ubigeo.codigo_ubigeo.slice(2)==="0000";
      });
      this.prov = data.find(ubigeo => {
        return ubigeo.codigo_ubigeo.slice(4)==="00" && ubigeo !=this.depart ;
      })
      this.distri = data.find(ubigeo => {
        return ubigeo.codigo_ubigeo.slice(4)!=="00";
      });
      //this.ubicacion = data[0].denominacion
    }, err => console.log(err))
  }

  getExplotacion(){
    this.predioService.getExplotacion().subscribe((data: any) => {
      this.lstexplotacion = data.results;
      this.register.get('explotacion').setValue(data.results[0].id);
    }, err => console.log(err))
  }
  getCategoriaPredioRustico(){
    this.predioService.getCategoriaPredioRustico().subscribe((data: any) => {
      this.lstcategoriaprediorustico = data;
      this.register.get('categoria_predio_rustico').setValue(data[0].codigo);
    }, err => console.log(err))
  }
  getGrupoAltitud(){
    this.predioService.getGrupoAltitud().subscribe((data: any) => {
      this.lstgrupoaltitud = data;
      this.register.get('grupo_altitud').setValue(data[0].codigo);
    }, err => console.log(err))
  }
  getGrupoTierra(){
    this.predioService.getGrupoTierra().subscribe((data: any) => {
      this.lstgrupotierra = data;
      this.register.get('grupo_tierra').setValue(data[0].codigo);
    }, err => console.log(err))
  }
  getCodigoTipoExplotacion(){
    this.predioService.getCodigoTipoExplotacion().subscribe((data: any) => {
      this.lstcodigotipoexplotacion = data;
      this.register.get('codigo_tipo_explotacion').setValue(data[0].codigo);
    }, err => console.log(err))
  }

  getMaestras(){
    this.predioService.getTablaMaestra().subscribe((data: any) => {
    }, err => console.log(err));
  }

  errorForm
  ccSiguiente=false;
  ClickSiguiente(){
    this.errorGetPredio = undefined;
    this.ccSiguiente = true;
   
    if (this.register.invalid) {
      console.log("asdasdasdasd")
      return;
    }

    this.load = true;
    let rusticoPredio = {
      cod_predio: "vacio",
      // cod_condicion_predio: "Vacio",
      cod_naturaleza_predio: "000000",//no debe enviar este campo en la db lo debe poner por defecto.
      cod_catastral : this.register.get('codigo_catastral').value,     
      cod_propiedad_predio: "001001",
      ubigeo: "050101",      
      ref_direccion: this.register.get('referencia').value,
      area_terreno: this.getTwoDecimals(this.register.get('area_del_terreno').value),
      area_contruida: this.getTwoDecimals(this.register.get('area_construida').value),
    
    }
    let send = {    
      cod_categoria_predio_rustico: this.register.get('categoria_predio_rustico').value,
      cod_grupo_altitud: this.register.get('grupo_altitud').value,
      cod_grupo_tierra: this.register.get('grupo_tierra').value,
      explotacion: this.register.get('explotacion').value,
      cod_tipo_explotacion: this.register.get('codigo_tipo_explotacion').value,
      porcent_explotacion: this.getTwoDecimals(this.register.get('explotacion1').value),//inte

    predio:null
      
      
    }

    if (this.isPatch) {
      const ID = localStorage.getItem("predio-rustico");
      delete send.predio;
      this.predioService.updatePredio(ID, send).subscribe(data => {
       this.predioService.updatePredioRustico(this.IDPREDIORUSTICO, rusticoPredio).subscribe(data => {
        this.router.navigate(['/predio/propietario'],
        { queryParams: { from : 'rustico' } });     
       }, err => {
        console.log(err);
        this.load = false;
        this.errorGetPredio = "No se pudo actualizar";
        window.scroll(0,0);
      });
      }, err => {
        console.log(err);
        this.load = false;
        this.errorGetPredio = "No se pudo actualizar";
        window.scroll(0,0);
      });
      
    } else {
      console.log("nuevopredio")
      send.predio = rusticoPredio
      this.predioService.crearPredioRustico(send).subscribe((data: any) => {
        this.load = false;
        if (data.id){
          localStorage.setItem("predio-rustico", data.predio.id.toString());
          this.router.navigate(['/predio/propietario'],
        { queryParams: { from : 'rustico' } });
        } else {
          console.log(data)
        }  
      }, err => {console.log(err);
        this.load = false;
        this.errorGetPredio = "No se pudo Crear el predio.";
        window.scroll(0,0);
      });
    }
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
  validarCampo(campo: string, validar: string): boolean {

    if (this.register.get(campo).hasError(validar) &&
      (this.formSubmitted || this.register.get(campo).touched))
      return true;
    else
      return false;
  }
  InputNumber(evt){
                
    var ch = String.fromCharCode(evt.which);
    
    if(!(/^\d*\.?\d*$/.test(ch))){
        evt.preventDefault();
    }
    
  }

  validarNumero(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode
    if (charCode >= 48 && charCode <= 57) {
      return true
    }
    return false
  }

  clicCancelar(){
    this.router.navigate(['dashboard/main'])
  }

  }
