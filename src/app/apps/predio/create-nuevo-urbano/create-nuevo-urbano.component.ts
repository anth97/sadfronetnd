import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PredioService } from './../services/predio.service';

@Component({
  selector: 'app-create-nuevo-urbano',
  templateUrl: './create-nuevo-urbano.component.html',
  styleUrls: ['./create-nuevo-urbano.component.sass']
})
export class CreateNuevoUrbanoComponent {

  ubicacion: any[]; //Ayacucho/Huamanga/Ayacucho
  depart: any;
  prov: any;
  distri: any;

  private defaultSelect = 'AAAAAA'

  isPatch: string | boolean = false; //verifica que no es una actualizacion
 
  lsttipozona = [ ]; //'tipo_zona': 

  lsthabilitacionurbana = [];

  lstterminado = [ ]; //estado_construcc

  lstregimen = [];

  lsttipovia = []; //'tipo_via': 

  lsttipopropiedad = []; //tipo_predio

  lstusopredio = [];//clasif_predio

  lstcondicionpropiedad = [ ];
  lstSector = []; //'sector'
  lstsituacion = [];
  lstregion = [];
  lstubicacion = [];

  error: any;

  register: FormGroup;
  hide = true;
  isBienComun=false;

  private regexForTwoDecimal: any = /^[0-9]{1,10}([.][0-9]{1,2})?$/
  private regexKilometro: any = /^[0-9]{1,6}([.][0-9]{1,2})?$/
  private regexInteger: any = /^[0-9]{1,10}?$/ //this is for integer with max: 2147483647 
  private regexFrente: any = /^[0-9]{1,5}([.][0-9]{1,2})?$/

  constructor(private fb: FormBuilder,
    private predioService: PredioService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    ) {
    this.initForm();    
    let url = window.location.href.split("/");    
    const PATH = url[url.length-1];//exist: urbano and nuevourbano
    //nuevo_bien_comun para predios bien comun
    if (PATH==="nuevourbano"){
      this.isPatch=false;
      
    } else if (PATH==="nuevo_bien_comun"){
      this.isPatch=false;
      this.isBienComun=true;
    }else {
      this.isPatch = localStorage.getItem("predio-urbano") || false;
    }
       
    if (this.isPatch){
      this.cargarDataPredio();
    }
  }
  errorGetPredio: string;
  IDPREDIOURBANO: string;

  load: boolean = false;
  
  cargarDataPredio(){
    this.predioService.getPredioById(this.isPatch).subscribe((data: any) => {
      this.register.get('codigo_catastral').setValue(data.cod_catastral);
      //this.register.get('tipo_propiedad').setValue(data.cod_propiedad_predio);
      this.register.get('region').setValue(data.cod_region_peru)
      this.register.get('situacion').setValue(data.cod_situacion_formal)
      this.register.get('referencia').setValue(data.ref_direccion);
      this.register.get('a_terreno').setValue(data.area_terreno);
      this.register.get('a_construida').setValue(data.area_contruida);
      //prediourbano
      this.IDPREDIOURBANO = data.prediourbano.id.toString()
      this.register.get('tipo_zona').setValue(data.prediourbano.cod_tipo_zona);
      this.register.get('habilitacion_urbana').setValue(data.prediourbano.habilitacion_urbana);
      this.register.get('uso_predio').setValue(data.prediourbano.cod_uso_predominante);
      this.register.get('terminado').setValue(data.prediourbano.cod_estado_contruccion)//estado
      this.register.get('tipo_via').setValue(data.prediourbano.cod_tipo_via);
      this.register.get('via_ubicacion').setValue(data.prediourbano.via_ubicacion);
      this.register.get('via_direccion').setValue(data.prediourbano.direccion);
      if (data.prediourbano.numero!=null){
        this.register.get('numero').setValue(data.prediourbano.numero);
      }
      this.register.get('departamento').setValue(data.prediourbano.department);
      this.register.get('interior').setValue(data.prediourbano.interior);
      this.register.get('manzana').setValue(data.prediourbano.manzana);
      this.register.get('interior_2').setValue(data.prediourbano.lote);
      if (data.prediourbano.kilometro!=null){
        this.register.get('kilometro').setValue(data.prediourbano.kilometro);
      }
      this.register.get('sector').setValue(data.prediourbano.cod_sector);
      this.register.get('tipo_propiedad').setValue(data.prediourbano.cod_tipo_predio);
      //this.register.get('uso_predio').setValue(data.prediourbano.cod_clasificacion_predio);
      if (data.prediourbano.dist_lado_calle_predio!=null){
        this.register.get('frente').setValue(data.prediourbano.dist_lado_calle_predio)
      }
      this.isPatch = true;
    }, err => {
      console.log(err);
      this.errorGetPredio="No existe este predio, intente crear uno nuevo"
      //localStorage.removeItem("predio-urbano");
      this.isPatch = false;
    })
  }
  
  initForm() {
    this.register= this.fb.group({
      tipo_zona: [this.defaultSelect, [Validators.pattern('[0-9]{6}')]],
      //zona: ['', [Validators.required,Validators.maxLength(100)]],
      habilitacion_urbana: [this.defaultSelect, [Validators.pattern('[0-9]')]],
      via_ubicacion: [this.defaultSelect, [Validators.pattern('[0-9]')]],
      codigo_catastral: [null, [Validators.maxLength(20)]],
      region: [this.defaultSelect, [Validators.required, Validators.pattern('[0-9]{6}')]],
      tipo_via: [this.defaultSelect, [Validators.pattern('[0-9]{6}')]],
      via_direccion: [null, [Validators.maxLength(100)]],
      numero: [null, [Validators.min(0), Validators.nullValidator, Validators.pattern(this.regexInteger)]],
      departamento: [null, [Validators.maxLength(5)]],
      interior: [null, [Validators.maxLength(5)]],
      manzana: [null, [Validators.maxLength(5)]],
      interior_2: [null, [Validators.maxLength(5)]],
      kilometro: [null, [ Validators.max(999999.99), Validators.min(0), Validators.pattern(this.regexKilometro)]],
      //estado: ['', [Validators.required,Validators.maxLength(10)]],
      sector: [this.defaultSelect, [Validators.pattern('[0-9]{6}')]],
      situacion: [this.defaultSelect, [Validators.pattern('[0-9]{6}')]],
      uso_predio: [this.defaultSelect, [Validators.pattern('[0-9]{6}')]],
      tipo_propiedad: [this.defaultSelect, [Validators.pattern('[0-9]{6}')]],
      //condicion_propiedad: ['', [Validators.required,Validators.maxLength(10)]],
      //condicion: ['', [Validators.required,Validators.maxLength(10)]],
      referencia: ['', [Validators.required,Validators.maxLength(200)]],
      frente: [null, [Validators.max(99999.99), Validators.min(0), Validators.nullValidator,
        Validators.pattern(this.regexFrente)]],
      a_terreno: [0, [Validators.required, Validators.min(0), 
        Validators.max(9999999999.99), Validators.pattern(this.regexForTwoDecimal)]],
      a_construida: [0, [Validators.required, Validators.min(0), 
        Validators.max(9999999999.99), Validators.pattern(this.regexForTwoDecimal)]],
      //regimen: ['', [Validators.required,Validators.maxLength(10)]],
      //exoneracion: ['', [Validators.required,Validators.maxLength(10)]],
      //fecha_inicio: ['', [Validators.required,Validators.maxLength(10)]],
      terminado: [this.defaultSelect, [Validators.pattern('[0-9]{6}')]]//label stado
    })
  }

  ngOnInit(): void {
    this.initForm();
    this.getUbigeos();
    this.getTipoZonas();
    this.getEstadosConstruc();
    this.getTipoVias();
    this.getUsosPredios();
    this.getSectores();
    this.getTipoPredios();
    this.getHabilitacionUrbanas();
    this.getLstRegiones();
    this.getLstSituacion();
    this.getLstUbicacion();
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

  getLstRegiones(){
    this.predioService.getRegiones().subscribe((data: any[]) => {
      this.lstregion = data;
    }, er => console.log(er))
  }

  getLstSituacion(){
    this.predioService.getCondicionPredio().subscribe((data: any[]) => {
      this.lstsituacion = data;
    }, err => console.log(err));
  }

  getTipoZonas(){
    this.predioService.getTipoZona().subscribe((data: any) => {
      this.lsttipozona = data;
    }, err => console.log(err));
  }

  getEstadosConstruc(){
    this.predioService.getEstado().subscribe((data: any) => {
      this.lstterminado = data;
    }, err => console.log(err));
  }

  getTipoVias(){
    this.predioService.getTipoVia().subscribe((data: any) => {
      this.lsttipovia = data;
    }, err => console.log(err));
  }

  getUsosPredios(){
    this.predioService.getUsoPredio().subscribe((data: any) => {
      this.lstusopredio = data;
    }, err => console.log(err));
  }

  getSectores(){
    this.predioService.getSector().subscribe((data: any) => {
      this.lstSector = data;
    }, err => console.log(err));
  }

  getTipoPredios(){
    this.predioService.getTipoPredio().subscribe((data: any) => {
      this.lsttipopropiedad = data;
    }, err => console.log(err));
  }
   
  //this.lstregimen = data.results;
    
  //this.lstcondicionpropiedad = data.results;
      

  getHabilitacionUrbanas(){
    this.predioService.getHabilitaciones().subscribe((data: any) => {
      this.lsthabilitacionurbana = data.results;
    }, err => console.log(err))
  }

  getLstUbicacion() {
    this.predioService.getViaUbigacion().subscribe((data: any) => {
      this.lstubicacion = data.results;
    }, err => console.log(err))
  }

  //OnChanges function

  changeFrente(event){
    
  }

  
  ccSiguiente=false;
  ClickSiguiente(){
    this.errorGetPredio = undefined;
    this.ccSiguiente = true;
    //valid form 
    if (this.register.invalid) {
      return;
    }
    
    this.load = true;
    let urbanoPredio = {
      //cod_clasificacion_predio: this.register.get('uso_predio').value,
      cod_tipo_predio: this.register.get('tipo_propiedad').value,
      cod_estado_contruccion: this.register.get('terminado').value,
      cod_tipo_zona: this.register.get('tipo_zona').value,
      cod_sector: this.register.get('sector').value,
      habilitacion_urbana: this.register.get('habilitacion_urbana').value,//no hay api
      via_ubicacion: this.register.get('via_ubicacion').value,
      cod_uso_predominante: this.register.get('uso_predio').value,
      cod_tipo_via: this.register.get('tipo_via').value,
      direccion: this.register.get('via_direccion').value,
      numero: this.getOnlyInteger(this.register.get('numero').value),
      kilometro: this.getTwoDecimals(this.register.get('kilometro').value),
      manzana: this.register.get('manzana').value,
      lote: this.register.get('interior_2').value,//interior 2 hace de lote
      department: this.register.get('departamento').value,
      interior: this.register.get('interior').value,
      dist_lado_calle_predio: this.getTwoDecimals(this.register.get('frente').value)
    }
    let send = { 
      cod_catastral : this.register.get('codigo_catastral').value,
      cod_situacion_formal: this.register.get('situacion').value,
      cod_region_peru: this.register.get('region').value,
      ref_direccion: this.register.get('referencia').value,
      area_terreno: this.getTwoDecimals(this.register.get('a_terreno').value),
      area_contruida: this.getTwoDecimals(this.register.get('a_construida').value),
      prediourbano: null
    }
    
    if (this.isPatch) {
      const ID = localStorage.getItem("predio-urbano");
      //delete send.prediourbano;
      send.prediourbano = urbanoPredio;
      send.prediourbano.id=this.IDPREDIOURBANO;
      this.predioService.updatePredio(ID, send).subscribe((data: any) => {
        localStorage.setItem("region", data.cod_region_peru)
        this.setDireccion(data.prediourbano);
        this.router.navigate(['predio/const']);
       
      }, err => {
        console.log(err);
        this.load = false;
        this.errorGetPredio = "No se pudo actualizar";
        window.scroll(0,0);
      });
    } else {
      send.prediourbano = urbanoPredio;
      this.predioService.crearPredio(send).subscribe((data: any) => {
        this.load = false;
        if (data.id){
          this.setDireccion(data.prediourbano)
          localStorage.setItem("predio-urbano", data.id.toString());
          localStorage.setItem("region", data.cod_region_peru) 
          this.router.navigate(['/predio/const'])
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

  
  InputNumber(evt){
    //verifica el tamaño maximo del imput y ya no le permite ingresar mas.
    var ch = String.fromCharCode(evt.which);  
    
    //patern for frente pattern="^[0-9]{1,5}(?:\.[0-9]{1,2})?$"
    if(!(/^\d*\.?\d*$/.test(ch))){
        evt.preventDefault();
    }    
  }

  setDireccion(data: any){
    console.log(data);
    let direcc = "";//via + interior + maz + lt
    if (data.direccion !=null){
      direcc += data.direccion;
    }
    if (data.interior !=null){
    direcc += " Int."+data.interior;
    }
    if (data.manzana !=null){
      direcc += " Mz."+data.manzana;
    }
    if (data.lote !=null){
      direcc += " Lt."+data.lote;
    }
    localStorage.setItem("predio-direcc", direcc)
  }

  clicCancelar(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        title: 'modal-title',        
        actions: 'd-grid gap-2 d-md-flex',
        confirmButton: 'btn btn-success btn-sm',
        cancelButton: 'btn btn-secondary btn-sm'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      html: '¿Desea cancelar el Registro de Predio?',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        'Aceptar',
      confirmButtonAriaLabel: 'Aceptar',
      //confirmButtonColor: '#28a745',
      cancelButtonText:'Cancelar',
      //cancelButtonColor: '#6c757d',
      cancelButtonAriaLabel: 'Cancelar',
      reverseButtons: true,
      //closeButtonHtml: '<button type="button" class="btn btn-secondary">Cancelar</button>'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.router.navigate(['dashboard/main'])
      } 
      
    });
    
  }


  createComun(){
    this.errorGetPredio = undefined;
    this.ccSiguiente = true;
    //valid form 
    if (this.register.invalid) {
      return;
    }
    
    this.load = true;
    let urbanoPredio = {
      //cod_clasificacion_predio: this.register.get('uso_predio').value,
      cod_tipo_predio: this.register.get('tipo_propiedad').value,
      cod_estado_contruccion: this.register.get('terminado').value,
      cod_tipo_zona: this.register.get('tipo_zona').value,
      cod_sector: this.register.get('sector').value,
      habilitacion_urbana: this.register.get('habilitacion_urbana').value,//no hay api
      via_ubicacion: this.register.get('via_ubicacion').value,
      cod_uso_predominante: this.register.get('uso_predio').value,
      cod_tipo_via: this.register.get('tipo_via').value,
      direccion: this.register.get('via_direccion').value,
      numero: this.getOnlyInteger(this.register.get('numero').value),
      kilometro: this.getTwoDecimals(this.register.get('kilometro').value),
      manzana: this.register.get('manzana').value,
      lote: this.register.get('interior_2').value,//interior 2 hace de lote
      department: this.register.get('departamento').value,
      interior: this.register.get('interior').value,
      dist_lado_calle_predio: this.getTwoDecimals(this.register.get('frente').value)
    }
    let send = { 
      cod_naturaleza_predio: '020003',//para bien comun, no debe estar aqui pero bueno.
      cod_catastral : this.register.get('codigo_catastral').value,
      cod_situacion_formal: this.register.get('situacion').value,
      cod_region_peru: this.register.get('region').value,
      ref_direccion: this.register.get('referencia').value,
      area_terreno: this.getTwoDecimals(this.register.get('a_terreno').value),
      area_contruida: this.getTwoDecimals(this.register.get('a_construida').value),
      prediourbano: null
    }
    
    if (this.isPatch) {
      const ID = localStorage.getItem("predio-urbano");
      //delete send.prediourbano;
      send.prediourbano = urbanoPredio;
      send.prediourbano.id = this.IDPREDIOURBANO;
      this.predioService.updatePredio(ID, send).subscribe((data: any) => {
        localStorage.setItem("region", data.cod_region_peru)
        this.setDireccion(data.prediourbano);//review
        this.router.navigate(['predio/const'], {queryParams:{from: 'biencomun'}});       
      }, err => {
        console.log(err);
        this.load = false;
        this.errorGetPredio = "No se pudo actualizar";
        window.scroll(0,0);
      });
    } else {
      send.prediourbano = urbanoPredio
      this.predioService.crearPredio(send).subscribe((data: any) => {
        this.load = false;
        if (data.id){
          this.setDireccion(data.prediourbano)
          localStorage.setItem("predio-urbano", data.id.toString());
          localStorage.setItem("region", data.cod_region_peru) 
          this.router.navigate(['/predio/const'], {queryParams:{from: 'biencomun'}});
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

  private getOnlyInteger(value: Number | null): Number | null{
    if (value==null){
      return value;
    }
    if (typeof(value)=='string'){
      value = +value;
    }
    console.log(value);
    return +value.toFixed()
  }

  private getTwoDecimals(value: Number | null): Number | null {
    if (value==null){
      return value;
    }
    if (typeof(value)=='string'){
      value = +value;
    }
    console.log(value);
    return +value.toFixed(2)
  }

  //Get values of cualquier elemento del form
  /*get zonaValue(): any {
    return this.register.get('zona');
  }*/
}

