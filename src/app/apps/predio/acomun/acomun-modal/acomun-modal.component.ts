import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PredioAreaComun } from 'src/app/core/interfaces/predio/predioAreaComun.interface';
import { TablaMaestra } from 'src/app/core/interfaces/public/tabla-maestra.interface';
import { PredioAreaComunService } from 'src/app/core/service/predio/predio-area-comun.service';
import { PredioConstruccionService } from 'src/app/core/service/predio/predio-construccion.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acomun-modal',
  templateUrl: './acomun-modal.component.html',
  styleUrls: ['./acomun-modal.component.sass']
})
export class AcomunModalComponent implements OnInit {

  public results: Array<PredioAreaComun> = [];
  public tablas: Array<TablaMaestra> = [];
  public form: FormGroup
  public formSubmitted: boolean = false;
  public selected: string;
  public total: number;
  public status = this.data['tipo'];
  public isDisabled: boolean = false;

  constructor(private router: Router,
    private predioAreaComunService: PredioAreaComunService,
    private predioConstruccionService: PredioConstruccionService,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<AcomunModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,  ) {
      this.form = this.formBuilder.group({
        predio: [Number(localStorage.getItem('predio-urbano'))],
        predio_bien_comun: this.formBuilder.group({
          codigo: ['', Validators.required],
          descripcion: ['', Validators.required],
          valor_bien_comun: ['', Validators.required],
          cod_tipo_bien_comun: ['', Validators.required],
          fec_inicio_vigencia: ['', Validators.required],
          antiguedad: ['',],
        }),
        porcent_condicion: ['', Validators.required],
        usuario_mod: [JSON.parse(localStorage.getItem("user")).id]
      })
    }

  ngOnInit(): void {
    //console.log(this.data);
    this.list()
    this.load(this.data['predio']['predio_bien_comun']['id'])

    if (this.status == 'view'){
      this.isDisabled = true;
    }
  }

  cancel(){
    this.dialogRef.close();
  }

  load(id: string){
    this.selected = id;
    return this.predioAreaComunService.listById(id).subscribe(results => this.form.patchValue(results));
  }

  update(){
    this.form.value.predio_bien_comun.antiguedad = this.antiguedad
    this.form.markAllAsTouched();
    if(this.form.invalid){
      console.log('error');
      return;
    }
    this.predioAreaComunService.edit(this.selected, this.form.value).subscribe(res=>{
      Swal.fire({
        text: 'El ítem fue actalizado',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#43C05B',
      });
      this.list()
      this.dialogRef.close();
    })
  }

  get antiguedad() {
    let fecha = new Date(this.form.get('predio_bien_comun').value.fec_inicio_vigencia);
    let fechaActual = new Date();
    let anios = fechaActual.getFullYear() - fecha.getFullYear();
    //console.log(anios);
    return anios
  }

  get valorBien() {
    let valor = (this.form.get('predio_bien_comun').value.valor_bien_comun * (this.form.get('porcent_condicion').value / 100))
    return valor
  }

  valorTotal() {
    this.total = 0
    this.results.forEach(e => {
      this.total += Number(e.valor_porcentaje);
    });
    return this.total
  }

  list() {
    let id = localStorage.getItem('predio-urbano')
    this.predioAreaComunService.list(id).subscribe(results => this.results = results);
    this.predioConstruccionService.listTabla('025').subscribe(tablas => this.tablas = tablas);
  }

  /* save() {    
    this.form.value['antiguedad'] = this.antiguedad
    //console.log( new Date(this.form.value['fe_inicio_vigencia']).toISOString());
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal!',
      });
      return;
    }
    this.predioAreaComunService.create(this.form.value).subscribe(results => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito...',
        text: 'Registro guardado correctamente!',
      });
      this.form.reset();
      this.form.value['predio'] = Number(localStorage.getItem('predio-urbano'))
      this.form.value['usuario_reg'] = JSON.parse(localStorage.getItem("user")).id
      this.form.value['usuario_mod'] = JSON.parse(localStorage.getItem("user")).id
      this.form.value['es_eliminado'] = 'false'
      this.list()
    })
  } */

  updatePredio(num: number) {
    let id = localStorage.getItem('predio-urbano')
    let data = {
      'progreso_registro': num,
    }
    console.log(id, data);
    this.predioConstruccionService.updatePredio(id, data).subscribe(results => {
      if (num == 4) {
        this.router.navigateByUrl('/predio/propietario')
      } else if (num == 3) {
        this.router.navigateByUrl('/predio/complements')
      }

    })
  }

  validarCampo(campo: string, validar: string): boolean {

    if (this.form.get(campo).hasError(validar) &&
      (this.formSubmitted || this.form.get(campo).touched))
      return true;
    else
      return false;
  }

  
}
