import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PredioAreaComunService } from '../../../core/service/predio/predio-area-comun.service';
import { PredioAreaComun } from '../../../core/interfaces/predio/predioAreaComun.interface';
import Swal from 'sweetalert2';
import { PredioConstruccionService } from 'src/app/core/service/predio/predio-construccion.service';
import { TablaMaestra } from 'src/app/core/interfaces/public/tabla-maestra.interface';
import { MatDialog } from '@angular/material/dialog';
import { AcomunModalComponent } from './acomun-modal/acomun-modal.component';


@Component({
  selector: 'app-acomun',
  templateUrl: './acomun.component.html',
  styleUrls: ['./acomun.component.sass']
})
export class AComunComponent implements OnInit {

  public results: Array<PredioAreaComun> = [];
  public tablas: Array<TablaMaestra> = [];
  public form: FormGroup
  public formSubmitted: boolean = false;

  public total: number;

  public isFromBienComun: boolean = false;

  constructor(private router: Router,
    private predioAreaComunService: PredioAreaComunService,
    private predioConstruccionService: PredioConstruccionService,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    public dialog: MatDialog,
    ) { 
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
        usuario_reg: [JSON.parse(localStorage.getItem("user")).id],
        usuario_mod: [JSON.parse(localStorage.getItem("user")).id]
      });
      this.activateRoute.queryParams.subscribe((params) => {
        console.log(params); // { from: "biencomun" }  
        if (params["from"] === "biencomun") {
          this.isFromBienComun = true;
        }
      });

    }

  ngOnInit(): void {
    this.list()

  }


  getPredioByAddress() {
    this.predioAreaComunService.getByAddress(localStorage.getItem('predio-direcc')).subscribe(res => {
      console.log(res);
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

  save() {
    this.form.value.predio_bien_comun.antiguedad = this.antiguedad
    this.form.value['predio'] = Number(localStorage.getItem('predio-urbano'))
    this.form.value['usuario_reg'] = JSON.parse(localStorage.getItem("user")).id
    this.form.value['usuario_mod'] = JSON.parse(localStorage.getItem("user")).id
    //console.log( new Date(this.form.value['fe_inicio_vigencia']).toISOString());
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      console.log('error');
      return;
    }
    this.predioAreaComunService.create(this.form.value).subscribe(results => {
      Swal.fire({
        text: 'El ítem fue agregado',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#43C05B',
      });
      this.form.reset();

      this.list()
    })
  }

  updatePredio(num: number) {
    let id = localStorage.getItem('predio-urbano')
    let data = {
      'progreso_registro': num,
    }
    console.log(id, data);
    this.predioConstruccionService.updatePredio(id, data).subscribe(results => {
      if (num == 4) {
        if (this.isFromBienComun){
          this.router.navigateByUrl('/predio/propietario');//nueva ruta.
        }else {
          this.router.navigateByUrl('/predio/propietario');
        }
      } else if (num == 3) {
        if (this.isFromBienComun){
          this.router.navigateByUrl('/predio/complements?from=biencomun');
        }else{
          this.router.navigateByUrl('/predio/complements');
        }
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

  clickA(cons: any, tipo: string) {
    const dialogRef = this.dialog.open(AcomunModalComponent, {
      width: '70%',
      height: '250px',
      data: { predio: cons, tipo: tipo }
    })

    dialogRef.afterClosed().subscribe(result => {

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
        this.predioAreaComunService.delete(id).subscribe(results => {
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
}
