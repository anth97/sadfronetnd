import { Component, Input, OnInit } from '@angular/core';
import { PredioConstruccionService } from '../../../core/service/predio/predio-construccion.service';
import { ConstruccionCategoria, PredioConst } from '../../../core/interfaces/predio/predioConst.interface';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablaMaestra } from '../../../core/interfaces/public/tabla-maestra.interface';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { ConstruccionModalComponent } from './construccion-modal/construccion-modal.component';

@Component({
  selector: 'app-construccion',
  templateUrl: './construccion.component.html',
  styleUrls: ['./construccion.component.sass']
})



export class ConstruccionComponent implements OnInit {

  public results: Array<PredioConst> = []; //lista de predios construccion
  public tablasConst: Array<TablaMaestra> = [];
  public tablasCons: Array<TablaMaestra> = [];
  public tablasEstConst: Array<TablaMaestra> = [];
  public tablasEstPred: Array<TablaMaestra> = [];

  public form: FormGroup
  public formSubmitted: boolean = false;
  public total: number

  loadAgregar = false;//load for boton agregar.
  loadListPredioConstruccion=false;

  isFromBienComun=false;
  constructor(private predioConstruccionService: PredioConstruccionService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private activateRoute: ActivatedRoute,) { 
      this.activateRoute.queryParams.subscribe((params) => {
        console.log(params); // { from: "biencomun" }  
        if (params["from"] === "biencomun") {
          this.isFromBienComun = true;
        }
      });
    }

  ngOnInit(): void {
    this.list()
    this.listTablas()

    this.form = this.formBuilder.group({
      cod_estado_construccion: ['', [Validators.required, Validators.maxLength(6)]],
      cod_estado_conservacion: ['', [Validators.required, Validators.maxLength(6)]],
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
      antiguedad: ['',],
      //valor_unitario_m2: ['', Validators.required],
      //valor_incremnto: ['', Validators.required],
      //porcent_depreciado: ['', Validators.required],
      predio: [Number(localStorage.getItem('predio-urbano'))],
    })
  }

  list() {
    this.total=0;
    this.loadListPredioConstruccion=true;
    let id = localStorage.getItem('predio-urbano')
    this.predioConstruccionService.list(id).subscribe(results => {
      this.results = results;
      this.loadListPredioConstruccion=false;
      this.valorTotal();
    }, err => {
      console.log(err);
      this.loadListPredioConstruccion=false;
    });
  }

  valorTotal() {
    this.total = 0
    this.results.forEach(e => {
      this.total += Number(e.valor_construccion);
    });
    return this.total
  }

  listTablas() {
    this.predioConstruccionService.listTabla('001').subscribe(tablas => this.tablasConst = tablas);
    this.predioConstruccionService.listTabla('011').subscribe(tablas => this.tablasCons = tablas);
    this.predioConstruccionService.listTabla('012').subscribe(tablas => this.tablasEstConst = tablas);
    this.predioConstruccionService.listTabla('015').subscribe(tablas => this.tablasEstPred = tablas);
  }

  
  save() {
    this.loadAgregar=true;
    this.form.value['predio'] = Number(localStorage.getItem('predio-urbano'))
    //console.log(this.form.value);
    this.form.value['antiguedad'] = this.antiguedad
    this.form.markAllAsTouched();
    console.log(this.form.value);
    if (this.form.invalid) {
      console.log('error');
      //return
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
      this.msgError("Intente más tarde, no se puede obtener la region");
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
        console.log(constr);
         this.predioConstruccionService.create(constr).subscribe(results => {
          this.loadAgregar=false;
          this.form.get('fec_inicio_vigencia').setValue("");
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
            html: 'El ítem fue agregado',
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText:
              'Aceptar',
            confirmButtonAriaLabel: 'Aceptar',
            //closeButtonHtml: '<button type="button" class="btn btn-secondary">Cancelar</button>'
          });
          this.form.reset();
          this.list();
        }, err => {
          this.loadAgregar = false;
          this.msgError("Ocurrió un error inesperado, intente más tarde o pongase en contacto con el administrador.");
        });

      }else{
        this.msgError("No existe información suficiente.")
      }
      
    }, err => {
      console.log(err);
      this.loadAgregar = false;
      this.msgError("Ocurrió un error inesperado, intente más tarde o pongase en contacto con el administrador.");
    })
    
    
    console.log("constr");
    /* this.predioConstruccionService.create(constr).subscribe(results => {

      Swal.fire({
        text: 'El ítem fue agregado',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#43C05B',
      });
      this.form.reset();

      console.log(this.form.value);
      this.list();
    }); */
    
    /* Swal.fire({
      text: 'El ítem fue agregado',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#43C05B',
    }); */
  }

  msgError(msg = "El ítem fue agregado"){
    Swal.fire({
      text: msg,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#43C05B',
    });
  }

  

  get antiguedad() {
    //console.log(this.form.get('fec_inicio_vigencia').value)
    let date = this.form.get('fec_inicio_vigencia').value;

    if (date?.length=='10'){
      let fecha = new Date(date);  
      let fechaActual = new Date();
      let anios = fechaActual.getFullYear() - fecha.getFullYear();
      return anios.toString();
    }
    return "0";
  }

  get depreciacion() {//aqui
    // let depreciacion = (Number(this.form.get('valor_unitario_m2').value) * (Number(this.form.get('porcent_depreciado').value)) / 100).toFixed(2);
    return 0
  }

  get construccion() { //aqui
    // let valor = ((this.form.get('valor_unitario_m2').value - Number(this.depreciacion)) * this.form.get('area_construida').value).toFixed(2)
    return 0
  } 

  updatePredio(num: number) {
    let id = localStorage.getItem('predio-urbano')
    let data = {
      'progreso_registro': num,
    }
    console.log(id, data);
    this.predioConstruccionService.updatePredio(id, data).subscribe(results => {
      if (num == 1) {
        this.router.navigateByUrl('/predio/urbano')
      } else if (num == 2) {
        if (this.isFromBienComun){
          this.router.navigateByUrl('/predio/complements?from=biencomun');
        }else {
          this.router.navigateByUrl('/predio/complements');
        }
      }

    })
  }

  atras() {
    if (this.isFromBienComun){
      this.router.navigateByUrl('/predio/biencomun');
    }else {
      this.router.navigateByUrl('/predio/urbano');
    }
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
    if (charCode >= 48 && charCode <= 57) {
      return true
    }
    return false
  }

  clickA(cons: any, tipo: string) {
    const dialogRef = this.dialog.open(ConstruccionModalComponent, {
      width: '80%',
      height: '70%',
      data: { predio: cons, tipo: tipo }
    })

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result)
      if (tipo=='update' && typeof(result)=='undefined'){
        this.list()
      }
    })
  }

  delete(id: string) {
    Swal.fire({
      title: 'Estas seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((res) => {
      if (res.value) {
        this.predioConstruccionService.delete(id).subscribe(results => {
          this.list()
          Swal.fire({
            icon: 'success',
            title: 'Éxito...',
            text: 'Registro eliminado correctamente!',
          });
        })
      }
    })
  }

  comparacion(lstConstruccCategoria: ConstruccionCategoria[]){
    let categorias = ""
    for(let i=0; i<lstConstruccCategoria.length; i++){
      if (lstConstruccCategoria[i].valor)
        categorias += lstConstruccCategoria[i].valor;
    }
    return categorias;
  }

  valorUnitarioByM2(lstConstruccCategoria: ConstruccionCategoria[]){
    return lstConstruccCategoria.reduce(
      (previousValue, currentValue) => previousValue + +currentValue.monto_valor,
      0
    );
  }

}



