import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PersonaNaturalService } from '../../../core/service/contribuyente/contribuyente-persona-natural.service';

@Component({
  selector: 'app-propietario',
  templateUrl: './propietario.component.html',
  styleUrls: ['./propietario.component.sass']
})
export class PropietarioComponent implements OnInit {

  public formPadre: FormGroup

  tipo_persona: string = "natural";
  TipoPersonaList = [
    "Persona Natural",
    "Persona Juridica"
  ]
  rusticoActive: boolean = false;

  private condicionPattern: any = /^[0-9]{1,3}([.][0-9]{2,2})?$/

  constructor(private router: Router,
    private personaNaturalService: PersonaNaturalService,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute) {
      this.activateRoute.queryParams
      .subscribe(params => {
        console.log(params); // { from: "rustico" }

        if (params["from"] ==="rustico"){
          this.rusticoActive = true;
        }

        console.log(this.rusticoActive); // true
      }
    );
    }
  lstPropiedad = [ ];
  lstTipoUso = [ ];

  ngOnInit(): void {
    this.getLstPropiedad();
    this.getLstTipoUso();
    this.formPadre = this.formBuilder.group({
      cod_tipo_cond_propiedad:['',[Validators.required]],
      cod_tipo_uso:['',[Validators.required]],
      porcentaje_condicion: ['',[Validators.required, Validators.pattern(this.condicionPattern)]],
    });
  }

  getLstPropiedad(){
    this.personaNaturalService.getPropiedadPredio().subscribe((data: any) => {
      this.lstPropiedad = data;
    }, err => console.log(err));
  }
  getLstTipoUso(){
    this.personaNaturalService.getTipoUso().subscribe((data: any) => {
      this.lstTipoUso = data;
    }, err => console.log(err));
  }
  
  InputNumber(evt){
    let key = false;
    var ch = String.fromCharCode(evt.which);
    if(!(/^\d*\.?\d*$/.test(ch))){
      evt.preventDefault();
    }
    
  }

  save_tipo(event) {
    this.tipo_persona = (<HTMLInputElement>document.getElementById("tipoPersona")).value;
    console.log(this.tipo_persona)
    
  }

}
