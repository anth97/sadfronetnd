import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PredioAreaComunCompartido } from 'src/app/core/interfaces/predio/predioAreaComun.interface';
import { PredioAreaComunService } from 'src/app/core/service/predio/predio-area-comun.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-copropietario',
  templateUrl: './copropietario.component.html',
  styleUrls: ['./copropietario.component.sass']
})
export class CopropietarioComponent implements OnInit {

  private condicionPattern: any = /^[0-9]{1,3}([.][0-9]{1,2})?$/
  codPredioBusqueda: string = "";
  loadAgregar: boolean = false;
  loadAtras: boolean = false;
  loadBusqueda: boolean = false;
  loadInitialData: boolean = false;
  loadLstCompartido: boolean = false;

  lstPrediosBusqueda = [];
  lstCompartido = [];
  idPredioBienComun;

  idPredio = localStorage.getItem('predio-urbano') || null;

  //montos obtenidos
  montoTerreno;
  montoConst;
  montoObra;

  public formCompartido: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private predioAreaComunService: PredioAreaComunService,
  ) { 
    this.initForm();
  }

  initForm(){
    this.formCompartido = this.formBuilder.group({
      predio: [1],
      porcent_terreno: ['', [Validators.required, 
        Validators.pattern(this.condicionPattern),
        Validators.max(100.00)
      ]],// igual a los 3 inputs de %
      
      user_reg: [100],
      user_mod: [100]
    });
  }

  ngOnInit(): void {
    this.gettingData();
  }
  

  public gettingData(){
    if (this.idPredio==null){
      this.errorMessage();
      return;
    }
    this.loadInitialData = true;
    this.predioAreaComunService.filterPredioAreaComun(this.idPredio).subscribe(
      data=> {
        if (data.results.length>0){
          this.idPredioBienComun = data.results[0].id;
          this.getListaCompartidos(data.results[0].id);
          this.montoTerreno = data.results[0].monto_valor_terreno;
          this.montoConst = data.results[0].monto_valor_const;
          this.montoObra = data.results[0].monto_valor_obra_comple;
        } else{
          this.errorMessage();
        }
        this.loadInitialData = false;
      }, err => {
        this.errorMessage();
        this.loadInitialData = false;
      }
    );

    
  }

  getListaCompartidos(idComun){
    this.loadLstCompartido = true;
    this.predioAreaComunService.list(idComun).subscribe(
      (data)=> {
        this.lstCompartido = data;
        console.log(this.lstCompartido);
        this.loadLstCompartido = false;
      }, err =>{
        this.loadLstCompartido = false;
      }
    );
  }

  InputNumber(evt){
    //verifica el tamaño maximo del imput y ya no le permite ingresar mas.
    var ch = String.fromCharCode(evt.which);  
    
    if(!(/^\d*\.?\d*$/.test(ch))){
      evt.preventDefault();
  }   
  }


  save(){
    let id = JSON.parse(localStorage.getItem("user")).id;
    if (this.lstPrediosBusqueda.length==0){
      this.errorMessage("Buesque un predio, para asignarlo.")
      return;
    }
    if (this.lstPrediosBusqueda[0].id==null){
      this.errorMessage("Predio invalido, busque un nuevo predio.")
      return;
    }

    let sendData: PredioAreaComunCompartido = {
      predio: +this.lstPrediosBusqueda[0].id,
      predio_bien_comun: this.idPredioBienComun,
      porcent_terreno: +this.formCompartido.get('porcent_terreno').value,
      porcent_construcc: +this.formCompartido.get('porcent_terreno').value,
      porcent_obra_comple: +this.formCompartido.get('porcent_terreno').value,
      monto_valor_porcent_terreno: this.valorTerreno,
      monto_valor_porcent_const: this.valorConstr,
      monto_valor_porcent_obra_compl: this.valorObra,
      usuario_reg: id,
      usuario_mod: id
    }
    this.loadAgregar=true;
    console.log(sendData);
    this.predioAreaComunService.create(sendData).subscribe(
      data => {
        this.getListaCompartidos(this.idPredioBienComun);
        this.loadAgregar=false;
      },
      err => {
        this.loadAgregar=false;
        this.errorMessage("No se puede agregar, intente más tarde", false);
      }
    ); 

  }

  startModalCoPropietario(item: string){

  }

  get valorTerreno(){
    if (this.formCompartido.get('porcent_terreno').value ==''){
      return 0;
    }
    return (+this.formCompartido.get('porcent_terreno').value * this.montoTerreno)/100
  }

  get valorConstr(){
    if (this.formCompartido.get('porcent_terreno').value ==''){
      return 0;
    }
    return (+this.formCompartido.get('porcent_terreno').value * this.montoConst)/100
  }

  get valorObra(){
    if (this.formCompartido.get('porcent_terreno').value ==''){
      return 0;
    }
    return (+this.formCompartido.get('porcent_terreno').value * this.montoObra)/100
  }

  delete(id){
    //init swieet alert with message.
    Swal.fire({
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        return fetch(`//api.github.com/users/${login}`)
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText)
            }
            return response.json()
          })
          .catch(error => {
            Swal.showValidationMessage(
              `Request failed: ${error}`
            )
          })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `${result.value.login}'s avatar`,
          imageUrl: result.value.avatar_url
        })
      }
    })
  }

  buscarPredio(){
    console.log(this.codPredioBusqueda);
    if (this.codPredioBusqueda==''){
      return;
    }
    this.loadBusqueda=true;
    this.predioAreaComunService.buscarPrediosByCodigo(this.codPredioBusqueda).subscribe(
      data => {
        if (data.results.length==0){
          this.loadBusqueda=false;
          this.errorMessage("No existe este predio.", false);
        }else {
          this.lstPrediosBusqueda = data.results;
          this.loadBusqueda=false;
        }
      }, err => {
        this.loadBusqueda=false;
        this.errorMessage("No se encontro el predio.")
      }
    )
  }

  errorMessage(msg = "Error en el servidor intente más tarde.", contacAdmin: boolean = true){
    if (contacAdmin){
      Swal.fire({
        icon: 'error',
        text: msg,
        footer: 'Pongase en contacto con el administrador'
      });
    } else {
      Swal.fire({
        icon: 'error',
        text: msg,
      });
    }
  }

  clickAtras(){

  }
  
  clickFinalizar(){

  }

  getDireccion(prediourbano){
    if (prediourbano==null){
      return "";
    }
    let dir = ""
    if (prediourbano.direccion){
      dir += prediourbano.direccion+" ";
    }
    if (prediourbano.interior){
      dir += "Int." + prediourbano.interior+" ";
    }
    if (prediourbano.manzana){
      dir += "Mz." + prediourbano.manzana+" ";
    }
    if (prediourbano.lote){
      dir += "Lt." + prediourbano.lote+" ";
    }
    return dir;
  }

  /**
   * Aun no lo acabo.
   * @param lstContrib : lista de contribuyentes;
   * @returns String 
   */
  getContribString(lstContrib){
    let contrib = ""
    if (lstContrib==null)
      return contrib;
    if (lstContrib.length==0){
      return contrib;
    }
    return contrib;
  }

}
