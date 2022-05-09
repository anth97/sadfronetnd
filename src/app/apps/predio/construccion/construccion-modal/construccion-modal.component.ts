import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ConstruccionCategoria, PredioConst } from 'src/app/core/interfaces/predio/predioConst.interface';
import { PredioConstruccionService } from 'src/app/core/service/predio/predio-construccion.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { TablaMaestra } from 'src/app/core/interfaces/public/tabla-maestra.interface';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-construccion-modal',
  templateUrl: './construccion-modal.component.html',
  styleUrls: ['./construccion-modal.component.sass']
})
export class ConstruccionModalComponent implements OnInit {

  public selected: string;
  public form: FormGroup
  public formSubmitted: boolean = false;
  //public id: string
  public results: Array<PredioConst> = [];
  public tablasConst: Array<TablaMaestra> = [];
  public tablasCons: Array<TablaMaestra> = [];
  public tablasEstConst: Array<TablaMaestra> = [];
  public tablasEstPred: Array<TablaMaestra> = [];
  public total:number;
  public status = this.data['tipo'];
  public isDisabled: boolean = false;
  private MUROS = '041001';
  private TECHOS = '041002';
  private PISOS = '041003';
  private PUERTAS = '041004';
  private REVESTI = '041005';
  private BANIOS = '041006';
  private ELECT = '041007';

  loadActualizar=false;
  loadData=false;
  constructor(private predioConstruccionService: PredioConstruccionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<ConstruccionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }



  ngOnInit(): void {

    this.load(this.data['predio']['id'])

    if (this.status == 'view'){
      this.isDisabled = true;
    }
    this.listTablas()

    this.form = this.formBuilder.group({
      cod_estado_construccion: ['', [Validators.required, Validators.maxLength(6)]],
      cod_estado_conservacion: ['',[Validators.required, Validators.maxLength(6)]],
      cod_estructura_predominante: ['', [Validators.required, Validators.maxLength(6)]],
      fec_inicio_vigencia: ['', Validators.required],      
      cat_contruccion_muro_columna: ['', [Validators.required, Validators.maxLength(6)]],
      cat_construccion_techo: ['', [Validators.required, Validators.maxLength(6)]],
      cat_construccion_piso: ['', [Validators.required, Validators.maxLength(6)]],
      cat_construccion_puerta_ventana: ['', [Validators.required, Validators.maxLength(6)]],
      cat_construccion_revestimiento: ['', [Validators.required, Validators.maxLength(6)]],
      cat_construccion_banio: ['', [Validators.required, Validators.maxLength(6)]],
      cat_construccion_electrico_sanitario: ['', [Validators.required, Validators.maxLength(6)]],
      area_construida: ['', Validators.required],
      nombre_bloque: ['', [Validators.required, Validators.maxLength(6)]],
      numero_piso: ['', Validators.required],
      //valor_unitario_m2: ['', Validators.required],
      //incremento: ['', Validators.required],
      //porcent_depreciado: ['', Validators.required],     
    })

  }

  
  update(){
    this.loadActualizar=true;
    this.form.markAllAsTouched();
    if(this.form.invalid){   
      this.loadActualizar=false;
      console.log(this.form.errors)
      this.msgError("Formulario invalido")
      return;
    }
    let constr: PredioConst = {
      predio: Number(localStorage.getItem('predio-urbano')),
      cod_estado_construccion: this.form.get('cod_estado_construccion').value,
      cod_estado_conservacion: this.form.get('cod_estado_conservacion').value,
      cod_estructura_predominante: this.form.get('cod_estructura_predominante').value,
      fec_inicio_vigencia: this.form.get('fec_inicio_vigencia').value,
      area_construida: this.form.get('area_construida').value,
      nombre_bloque: this.form.get('nombre_bloque').value,
      numero_piso: this.form.get('numero_piso').value,
      antiguedad: +this.antiguedad,
      //valor_unitario_m2: number,

      //valor_incremento: this.form.get('valor_incremnto').value,
      //porcent_increment: this.form.get('incremento').value,
      porcent_depreciado:0,
      valor_depreciado: 3,
      valor_construccion: 3,
      predioconstruccioncategoria_set: []
    };

    const REGION = localStorage.getItem("region") || "";
    if (REGION===""){
      this.msgError("No existe region.")
      return;
    }
    const CODIGOS = this.form.get('cat_contruccion_muro_columna').value
      + "," + this.form.get('cat_construccion_techo').value
      + "," + this.form.get('cat_construccion_piso').value
      +","+ this.form.get('cat_construccion_puerta_ventana').value
      + "," + this.form.get('cat_construccion_revestimiento').value
      + "," + this.form.get('cat_construccion_banio').value
      + "," + this.form.get('cat_construccion_electrico_sanitario').value;
    this.predioConstruccionService.getPredioConstruccionCategoria(
      REGION, CODIGOS,
      this.form.get('area_construida').value
    ).subscribe((data: any) => {
      if (data.length==7){
        constr.predioconstruccioncategoria_set=data;
        //console.log(constr);
        
         this.predioConstruccionService.edit(this.selected, constr).subscribe(results => {
          this.loadActualizar=false;
          Swal.fire({
            text: 'El ítem fue actualizado',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#43C05B',
          });

          this.dialogRef.close();
        }, err => {
          this.loadActualizar=false;
          this.msgError("Ocurrió un error inesperado, intente más tarde o pongase en contacto con el administrador.");
        });

      }else{
        this.loadActualizar=false;
        this.msgError("No existe información suficiente.")
      }
    }, err => {
      this.loadActualizar=false;
    })

  }

  msgError(msg = "El ítem fue agregado"){
    Swal.fire({
      text: msg,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#43C05B',
    });
  }
  
  cancel(){
    this.dialogRef.close("no");
  }
  
  load(id: string) { 
    this.loadData=true;       
    this.selected = id;
    return this.predioConstruccionService.listById(id).subscribe((predio: any) => {

      this.form.get('nombre_bloque').setValue(predio.nombre_bloque);
      this.form.get('numero_piso').setValue(predio.numero_piso);
      this.form.get('area_construida').setValue(predio.area_construida);
      if (predio.fec_inicio_vigencia !=null){
        this.form.get('fec_inicio_vigencia').setValue(predio.fec_inicio_vigencia.slice(0,10));
      }
      this.form.get('cod_estructura_predominante').setValue(predio.cod_estructura_predominante);
      this.form.get('cod_estado_conservacion').setValue(predio.cod_estado_conservacion);
      this.form.get('cod_estado_construccion').setValue(predio.cod_estado_construccion);
      this.handleCategorias(predio.predioconstruccioncategoria_set);
      this.loadData=false;
    }, err => {
      this.loadData=false;
    }); 
  }

  
  handleCategorias(lstConstruccCategoria: ConstruccionCategoria[]){
    //for muros
    for(let i=0; i<lstConstruccCategoria.length;i++){
      if (lstConstruccCategoria[i].cod_clasificacion_cate_construcc==this.MUROS){
        this.form.get('cat_contruccion_muro_columna').setValue(lstConstruccCategoria[i].cod_cate_construcc);
        lstConstruccCategoria.splice(i,1);
        break;
      }
    }
    // for techos
    for(let i=0; i<lstConstruccCategoria.length;i++){
      if (lstConstruccCategoria[i].cod_clasificacion_cate_construcc==this.TECHOS){
        this.form.get('cat_construccion_techo').setValue(lstConstruccCategoria[i].cod_cate_construcc);
        lstConstruccCategoria.splice(i,1);
        break;
      }
    }
    // for pisos
    for(let i=0; i<lstConstruccCategoria.length;i++){
      if (lstConstruccCategoria[i].cod_clasificacion_cate_construcc==this.PISOS){
        this.form.get('cat_construccion_piso').setValue(lstConstruccCategoria[i].cod_cate_construcc);
        lstConstruccCategoria.splice(i,1);
        break;
      }
    }

    // for puertas
    for(let i=0; i<lstConstruccCategoria.length;i++){
      if (lstConstruccCategoria[i].cod_clasificacion_cate_construcc==this.PUERTAS){
        this.form.get('cat_construccion_puerta_ventana').setValue(lstConstruccCategoria[i].cod_cate_construcc);
        lstConstruccCategoria.splice(i,1);
        break;
      }
    }

    // for REVISTIMIENTO
    for(let i=0; i<lstConstruccCategoria.length;i++){
      if (lstConstruccCategoria[i].cod_clasificacion_cate_construcc==this.REVESTI){
        this.form.get('cat_construccion_revestimiento').setValue(lstConstruccCategoria[i].cod_cate_construcc);
        lstConstruccCategoria.splice(i,1);
        break;
      }
    }

    // for banios
    for(let i=0; i<lstConstruccCategoria.length;i++){
      if (lstConstruccCategoria[i].cod_clasificacion_cate_construcc==this.BANIOS){
        this.form.get('cat_construccion_banio').setValue(lstConstruccCategoria[i].cod_cate_construcc);
        lstConstruccCategoria.splice(i,1);
        break;
      }
    }

    // for electrico
    for(let i=0; i<lstConstruccCategoria.length;i++){
      if (lstConstruccCategoria[i].cod_clasificacion_cate_construcc==this.ELECT){
        this.form.get('cat_construccion_electrico_sanitario').setValue(lstConstruccCategoria[i].cod_cate_construcc);
        lstConstruccCategoria.splice(i,1);
        break;
      }
    }
  }

  

  listTablas(){
    this.predioConstruccionService.listTabla('001').subscribe(tablas=> this.tablasConst = tablas);
    this.predioConstruccionService.listTabla('011').subscribe(tablas=>  this.tablasCons = tablas);
    this.predioConstruccionService.listTabla('012').subscribe(tablas=>  this.tablasEstConst = tablas);
    this.predioConstruccionService.listTabla('015').subscribe(tablas=>  this.tablasEstPred = tablas);
  }


  get antiguedad(){    
    let date = this.form.get('fec_inicio_vigencia').value;

    if (date?.length=='10'){
      console.log(date);
      let fecha = new Date(date);
      let fechaActual = new Date();
      let anios = fechaActual.getFullYear() - fecha.getFullYear();
      return anios.toString().trim();
    }
    return "0";
  }
  
  get depreciacion(){
    let depreciacion = (Number(this.form.get('valor_unitario_m2').value) *  (Number(this.form.get('porcent_depreciado').value)) /100).toFixed(2);
    return depreciacion
  }

  get construccion(){
    let valor = ((this.form.get('valor_unitario_m2').value - Number(this.depreciacion))*this.form.get('area_construida').value).toFixed(2)    
    return valor
  }


  validarCampo(campo: string, validar: string): boolean {

    if (this.form.get(campo).hasError(validar) &&
      (this.formSubmitted || this.form.get(campo).touched))
      return true;
    else
      return false;
  }

  validarNumero(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode
    if (charCode >= 48 && charCode <= 57){
      return true
    }
    return false
  }

}
