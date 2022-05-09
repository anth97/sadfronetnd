import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaJuridicaService } from '../../../core/service/contribuyente/contribuyente-persona-juridica.service';
import { PersonaJuridica } from '../../../core/interfaces/contribuyente/personaJuridica.interface';
import { Ubigeo } from 'src/app/core/interfaces/contribuyente/ubigeo.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { PredioService } from '../../predio/services/predio.service';
import { environment } from 'src/environments/environment';
import { PersonaNatural } from 'src/app/core/interfaces/contribuyente/personaNatural.interface';

@Component({
  selector: 'app-registro-persona-juridica',
  templateUrl: './registro-persona-juridica.component.html',
  styleUrls: ['./registro-persona-juridica.component.sass']
})
export class RegistroPersonaJuridicaComponent implements OnInit {
  public results: Array<PersonaJuridica> = [];

  


  public form: FormGroup;
  @Input() formPadre: FormGroup;
  public formSubmitted: boolean = false;

  rusticoActive: boolean = false;

  constructor(
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private personaJuridicaService: PersonaJuridicaService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,    
    private predioService: PredioService,
    ) {
      this.activateRoute.queryParams
      .subscribe(params => {
        console.log(params); // { from: "rustico" }

        if (params["from"] ==="rustico"){
          this.rusticoActive = true;
        }

        console.log(this.rusticoActive); // true
      }
    );
    this.initForm();
  }

  ngOnInit(): void {
    this.getTipoDoc();
    this.getTipoVias();
    this.getDepartamentos();
    
    this.form = this.fb.group({
      
      /* cod_tipo_cond_propiedad:['',[Validators.required]],
      porcentaje_condicion: ['',[Validators.required,Validators.maxLength(7)]],
       */
      num_ruc: ['', [Validators.required,Validators.minLength(11)] ],
      
      razon_social: ['',[Validators.required,], ],
      fec_constitucion:['', [Validators.required]],
      telefono_principal: ['',[Validators.required, Validators.minLength(9)]],
      telefono_secundario: ['',[Validators.minLength(9)]],
      correo_electronico: ['',[Validators.required, Validators.email, Validators.minLength(5)],],

      //Domicilio Fiscal
      codigo_depart:['',[Validators.required]],
      codigo_prov:['',[Validators.required]],
      codigo_dist:['',[Validators.required]],

      cod_tipo_via:['',[Validators.required]],
      domicilio: ['', [Validators.required]],
      nro_domicilio: ['', [Validators.required]],
      referencia_domicilio:[''],

      //Representante Legal
      apellido_paterno: ['', [Validators.required]],
      apellido_materno: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      cod_tipo_doc_identidad:['',[Validators.required]],
      num_documento_identidad:['',[Validators.required]],

      es_eliminado:[false],
      fec_reg: [
        this.datepipe.transform(this.actualDate, "dd-MM-yyyy hh:mm:ss"),
      ],
      fec_mod: [
        this.datepipe.transform(this.actualDate, "dd-MM-yyyy hh:mm:ss"),
      ],

      
    });

    this.form.controls['fec_constitucion'].disable();
    this.form.controls['razon_social'].disable();
    this.form.controls['telefono_principal'].disable();
    this.form.controls['telefono_secundario'].disable();
    this.form.controls['correo_electronico'].disable();

    this.form.controls['codigo_depart'].disable();
    this.form.controls['codigo_prov'].disable();
    this.form.controls['codigo_dist'].disable();

    this.form.controls['cod_tipo_via'].disable();
    this.form.controls['domicilio'].disable();
    this.form.controls['nro_domicilio'].disable();
    this.form.controls['referencia_domicilio'].disable();

    this.form.controls['cod_tipo_doc_identidad'].disable();
    

    this.form.controls['num_documento_identidad'].disable();
    this.form.controls['apellido_paterno'].disable();
    this.form.controls['apellido_materno'].disable();
    this.form.controls['nombre'].disable();

    
  }

  save(){
    console.log(this.personaJuridicaExiste)
    console.log(this.contribuyenteExiste)
    console.log(this.representanteExiste)
    
    
    

    if(
      this.personaJuridicaExiste == false &&
      this.contribuyenteExiste == false &&
      this.representanteExiste == false
    )
    {
      console.log("No existe nada")

      let usuario = localStorage.getItem("user");
      let usuarioJson = JSON.parse(usuario);
      let oPersonaJuridica;
      oPersonaJuridica = {
        contribuyente: {
          ubigeo: this.form.controls['codigo_dist'].value.codigo_ubigeo,
          cod_tipo_contribuyente: "001002",
          cod_tipo_via: this.form.controls['cod_tipo_via'].value.codigo,
          domicilio: this.form.controls['domicilio'].value,
          nro_domicilio: this.form.controls['nro_domicilio'].value,
          referencia_domicilio: this.form.controls['referencia_domicilio'].value,
          telefono_principal: this.form.controls['telefono_principal'].value,
          telefono_secundario: this.form.controls['telefono_secundario'].value,
          correo_electronico: this.form.controls['correo_electronico'].value,
          personajuridica: {
            representante_legal: {
                nombre: this.form.controls['nombre'].value,
                apellido_paterno: this.form.controls['apellido_paterno'].value,
                apellido_materno: this.form.controls['apellido_materno'].value,
                cod_tipo_doc_identidad: this.form.controls['cod_tipo_doc_identidad'].value.codigo,
                num_documento_identidad: this.form.controls['num_documento_identidad'].value,
                cod_sexo: null,
                fec_reg: this.form.controls["fec_reg"].value,
                fec_mod: this.form.controls["fec_mod"].value,
                usuario_mod_id: usuarioJson.id,
                usuario_reg_id: usuarioJson.id
            },
            cod_tipo_persona_juridica: "009009",
            razon_social: this.form.controls['razon_social'].value,
            num_ruc: this.form.controls['num_ruc'].value,
            fec_constitucion: this.form.controls['fec_constitucion'].value,
            fec_reg: this.form.controls["fec_reg"].value,
            fec_mod: this.form.controls["fec_mod"].value,
            usuario_mod_id: usuarioJson.id,
            usuario_reg_id: usuarioJson.id
          },
        },
        //Number(localStorage.getItem("predio-urbano"))
        predio: 1,
        cod_tipo_uso: this.cod_tipo_uso,
        cod_tipo_propietario: this.cod_tipo_propietario,
        fec_inicio_vigencia: null,
        fec_fin_vigencia: null,
        porc_propiedad: this.porc_propiedad,
      }
      console.log(oPersonaJuridica);
      this.personaJuridicaService.create(oPersonaJuridica).subscribe(data=>{ 
        this.router.navigate(['/predio/urbano']);
        Swal.fire({
          icon: 'success',
          title: 'Registro Actualizado',
          text: 'El registro fue guardado exitósamente',
        })
      })
    }

    if(
      this.personaJuridicaExiste == false &&
      this.contribuyenteExiste == false &&
      this.representanteExiste == true
    )
    {
      console.log("Existe el representante legal")

      let usuario = localStorage.getItem("user");
      let usuarioJson = JSON.parse(usuario);
      let oPersonaJuridica;
      oPersonaJuridica = {
        contribuyente: {
          ubigeo: this.form.controls['codigo_dist'].value.codigo_ubigeo,
          cod_tipo_contribuyente: "001002",
          cod_tipo_via: this.form.controls['cod_tipo_via'].value.codigo,
          domicilio: this.form.controls['domicilio'].value,
          nro_domicilio: this.form.controls['nro_domicilio'].value,
          referencia_domicilio: this.form.controls['referencia_domicilio'].value,
          telefono_principal: this.form.controls['telefono_principal'].value,
          telefono_secundario: this.form.controls['telefono_secundario'].value,
          correo_electronico: this.form.controls['correo_electronico'].value,
          personajuridica: {
            representante_legal: this.representante_legal_id,
            cod_tipo_persona_juridica: "009009",
            razon_social: this.form.controls['razon_social'].value,
            num_ruc: this.form.controls['num_ruc'].value,
            fec_constitucion: this.form.controls['fec_constitucion'].value,
            fec_reg: this.form.controls["fec_reg"].value,
            fec_mod: this.form.controls["fec_mod"].value,
            usuario_mod_id: usuarioJson.id,
            usuario_reg_id: usuarioJson.id
          },
        },
        //Number(localStorage.getItem("predio-urbano"))
        predio: 1,
        cod_tipo_uso: this.cod_tipo_uso,
        cod_tipo_propietario: this.cod_tipo_propietario,
        fec_inicio_vigencia: null,
        fec_fin_vigencia: null,
        porc_propiedad: this.porc_propiedad,
      }
      console.log(oPersonaJuridica);
      this.personaJuridicaService.createTwo(oPersonaJuridica).subscribe(data=>{ 
        this.router.navigate(['/predio/urbano']);
        Swal.fire({
          icon: 'success',
          title: 'Registro Actualizado',
          text: 'El registro fue guardado exitósamente',
        })
      })

    }
    
    if(
      this.personaJuridicaExiste == true &&
      this.contribuyenteExiste == true &&
      this.representanteExiste == true
    )
    {
      console.log("Todos existen")

      let usuario = localStorage.getItem("user");
      let usuarioJson = JSON.parse(usuario);
      let oPersonaJuridica;
      oPersonaJuridica = {
        contribuyente: this.contribuyente_id,
        //Number(localStorage.getItem("predio-urbano"))
        predio: 1,
        cod_tipo_uso: this.cod_tipo_uso,
        cod_tipo_propietario: this.cod_tipo_propietario,
        fec_inicio_vigencia: null,
        fec_fin_vigencia: null,
        porc_propiedad: this.porc_propiedad,
      }
      console.log(oPersonaJuridica);
      this.personaJuridicaService.createThree(oPersonaJuridica).subscribe(data=>{ 
        this.router.navigate(['/predio/urbano']);
        Swal.fire({
          icon: 'success',
          title: 'Registro Actualizado',
          text: 'El registro fue guardado exitósamente',
        })
      })

    }

  }

  personaJuridicaExiste = false;
  contribuyenteExiste = false;
  representanteExiste = false;

  contribuyente_id = 0;
  representante_legal_id = 0;


  actualDate = new Date();
  lstRepresentantes = [];
  personaJuridica = [];

  lstDepartamentos = [ ];
  lstProvincias = [ ];
  lstDistritos = [ ];
  lstVias=[];
  lstDocumentos = [ ];
  lstDocumentosLength = [
    {
      codigo:"027001",
      length: 8,
    },
    {
      codigo:"027002",
      length: 12,
    },
    {
      codigo:"027003",
      length: 11,
    },
    {
      codigo:"027004",
      length: 12,
    },
    {
      codigo:"027005",
      length: 15,
    },
    {
      codigo:"027006",
      length: 15,
    },
  ];

  @Input() cod_tipo_propietario = "";
  @Input() cod_tipo_uso = "";
  @Input() porc_propiedad = "";

  fec_constitucion: Date;
  cod_tipo_via = this.lstVias[0];
  length = 0;

  depart = this.lstDepartamentos[0];
  prov = this.lstProvincias[0];
  dist = this.lstDistritos[0];

  s_num_ruc: String = "";
  s_num_documento_identidad: String = "";

  hide = true;

  initForm() {
    
  }

  getTipoDoc(){
    this.personaJuridicaService.getTipoDoc().subscribe((data: any) => {
      this.lstDocumentos = data;
    }, err => console.log(err));
  }
  getTipoVias(){
    this.personaJuridicaService.getTipoVia().subscribe((data: any) => {
      this.lstVias = data;
    }, err => console.log(err));
  }

  onRegister() {
    console.log('Form Value', this.form.value);
  }
  InputNumber(evt){
    var ch = String.fromCharCode(evt.which);
    if(!(/[0-9]/.test(ch))){
        evt.preventDefault();
    }
  }
  InputCharacter(event) {
    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-ñÑáéíóúÁÉÍÓÚ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onChangeVia(){
    console.log(this.form.controls['cod_tipo_via'].value);
  }
  onChangeFecha(){
    console.log(this.form.controls['fec_constitucion'].value);
  }

  onChangeDocumento(){
    this.s_num_documento_identidad="";
    for (let length of this.lstDocumentosLength){
      if (length.codigo == this.form.controls['cod_tipo_doc_identidad'].value.codigo){
        this.length = length.length;
      }
    }
    this.form.controls['num_documento_identidad'].enable();
    console.log("Cambio");
    console.log(this.length);
  }

  list() {
    this.personaJuridicaService.list().subscribe(results => this.results = results);
  } 

  searchPersonaJuridica(){
    this.getTipoDoc();
    this.getTipoVias();
    this.getDepartamentos();

    this.resetFields();

    this.personaJuridicaExiste = false;
    this.contribuyenteExiste = false;
    this.representanteExiste = false;


    console.log(this.s_num_ruc)
    if(this.s_num_ruc == ""){
      console.log("Escriba algo")
    } else {
      if( 11 == this.s_num_ruc.length){
        console.log("Buscando a la persona")

          this.getPersonaJuridica(String(this.s_num_ruc))
          
          
      } else {
        console.log("número de dígitos inválido")
      }
    }
  }

  getPersonaJuridica(ruc: string){
    this.personaJuridicaService.getPersonaJuridica(ruc).subscribe((data: any) => {
      
      this.personaJuridica = data.results;

      console.log(this.personaJuridica)
      console.log(this.personaJuridica.length)

      if( this.personaJuridica.length != 0){

        //Booleano que controla el tipo de guardado
        this.personaJuridicaExiste = true;
        console.log(this.personaJuridicaExiste)

        this.form.controls['fec_constitucion'].disable();
        this.form.controls['razon_social'].disable();

        var fecha = this.personaJuridica[0].fec_constitucion;

        
        this.form.controls['razon_social'].setValue(this.personaJuridica[0].razon_social);
        this.form.controls['fec_constitucion'].setValue(fecha.substring(0,10));
        console.log(fecha.substring(0,10))
        //contribuyente
        if(this.personaJuridica[0].contribuyente != null){
          //Booleano que controla el tipo de guardado
          this.contribuyenteExiste = true;
          console.log(this.personaJuridica[0].contribuyente.id);
          this.contribuyente_id = this.personaJuridica[0].contribuyente.id;

          this.form.controls['telefono_principal'].disable();
          this.form.controls['telefono_secundario'].disable();
          this.form.controls['correo_electronico'].disable();

          this.form.controls['codigo_depart'].disable();
          this.form.controls['codigo_prov'].disable();
          this.form.controls['codigo_dist'].disable();

          this.form.controls['cod_tipo_via'].disable();
          this.form.controls['domicilio'].disable();
          this.form.controls['nro_domicilio'].disable();
          this.form.controls['referencia_domicilio'].disable();

          this.form.controls['telefono_principal'].setValue(this.personaJuridica[0].contribuyente.telefono_principal);
          this.form.controls['telefono_secundario'].setValue(this.personaJuridica[0].contribuyente.telefono_secundario);
          this.form.controls['correo_electronico'].setValue(this.personaJuridica[0].contribuyente.correo_electronico);
          this.form.controls['domicilio'].setValue(this.personaJuridica[0].contribuyente.domicilio);
          this.form.controls['nro_domicilio'].setValue(this.personaJuridica[0].contribuyente.nro_domicilio);
          this.form.controls['referencia_domicilio'].setValue(this.personaJuridica[0].contribuyente.referencia_domicilio);

          for (let via of this.lstVias){
            if(via.codigo==this.personaJuridica[0].contribuyente.cod_tipo_via){
              this.form.controls["cod_tipo_via"].setValue(
                via
                );
              break;
            }
          }

          var departamento = this.personaJuridica[0].contribuyente.ubigeo.substring(0, 2)
          var provincia = this.personaJuridica[0].contribuyente.ubigeo.substring(2, 4)
          var distrito = this.personaJuridica[0].contribuyente.ubigeo.substring(4, 6)

          this.personaJuridicaService.searchDepartamento(departamento, "00", "00").subscribe(
            (data: any) => {
              this.lstDepartamentos = data.results;
              this.form.controls["codigo_depart"].setValue(this.lstDepartamentos[0]);

              this.personaJuridicaService.searchDepartamento(departamento, provincia, "00").subscribe(
                (data: any) => {
                  this.lstProvincias = data.results;
                  this.form.controls["codigo_prov"].setValue(this.lstProvincias[0]);

                  this.personaJuridicaService.searchDepartamento(departamento, provincia, distrito).subscribe(
                    (data: any) => {
                      this.lstDistritos = data.results;
                      this.form.controls["codigo_dist"].setValue(this.lstDistritos[0]);

                    },
                    (err) => console.log(err)
                  );
                },
                (err) => console.log(err)
              );

            },
            (err) => console.log(err)
          );
        } else {
          console.log("Contribuyente nulo")
          //Booleano que controla el tipo de guardado
          this.contribuyenteExiste = false;
          this.contribuyente_id = 0;

          this.form.controls['telefono_principal'].enable();
          this.form.controls['telefono_secundario'].enable();
          this.form.controls['correo_electronico'].enable();

          this.form.controls['codigo_depart'].enable();
          this.form.controls['codigo_prov'].enable();
          this.form.controls['codigo_dist'].enable();

          this.form.controls['cod_tipo_via'].enable();
          this.form.controls['domicilio'].enable();
          this.form.controls['nro_domicilio'].enable();
          this.form.controls['referencia_domicilio'].enable();
          
        }
        if(this.personaJuridica[0].representante_legal != null){
          //Booleano que controla el tipo de guardado
          this.representanteExiste = true;
          console.log(this.personaJuridica[0].representante_legal.id)
          this.representante_legal_id = this.personaJuridica[0].representante_legal.id;

          this.form.controls['num_documento_identidad'].disable();
          this.form.controls['apellido_paterno'].disable();
          this.form.controls['apellido_materno'].disable();
          this.form.controls['nombre'].disable();

          this.form.controls['num_documento_identidad'].setValue(this.personaJuridica[0].representante_legal.num_documento_identidad);
          this.form.controls['apellido_paterno'].setValue(this.personaJuridica[0].representante_legal.apellido_paterno);
          this.form.controls['apellido_materno'].setValue(this.personaJuridica[0].representante_legal.apellido_materno);
          this.form.controls['nombre'].setValue(this.personaJuridica[0].representante_legal.nombre);
          for (let tipoDoc of this.lstDocumentos){
            if(tipoDoc.codigo==this.personaJuridica[0].representante_legal.cod_tipo_doc_identidad){

              this.form.controls["cod_tipo_doc_identidad"].setValue(tipoDoc);
              break;
            }
          };
        } else {
          console.log("No se encontró al representante")
          //Booleano que controla el tipo de guardado
          this.representanteExiste = false;
          this.representante_legal_id = 0;

          this.form.controls['cod_tipo_doc_identidad'].enable();
          
        }

      } else {
        console.log("No se encontró a la persona")
        //Booleano que controla el tipo de guardado
        this.personaJuridicaExiste = false;

        this.form.controls['fec_constitucion'].enable();
        this.form.controls['razon_social'].enable();
        this.form.controls['telefono_principal'].enable();
        this.form.controls['telefono_secundario'].enable();
        this.form.controls['correo_electronico'].enable();

        this.form.controls['codigo_depart'].enable();


        this.form.controls['cod_tipo_via'].enable();
        this.form.controls['domicilio'].enable();
        this.form.controls['nro_domicilio'].enable();
        this.form.controls['referencia_domicilio'].enable();

        this.form.controls['cod_tipo_doc_identidad'].enable();
        
      }

    }, err => console.log(err));
  }

  searchRepresentante(){
    this.form.controls['apellido_paterno'].setValue("");
    this.form.controls['apellido_materno'].setValue("");
    this.form.controls['nombre'].setValue("");

    this.representanteExiste = false;

    console.log(this.s_num_documento_identidad)
    if(this.s_num_documento_identidad == ""){
      console.log("Escriba algo")
    } else {
      if(this.length == this.s_num_documento_identidad.length){
        console.log("Buscando a la persona")
        

        this.getRepresentanteLegal(String(this.s_num_documento_identidad))

      } else {
        console.log("número de dígitos inválido")
      }
    }
  }

  getRepresentanteLegal(num_iden: string){
    this.personaJuridicaService.getRepresentanteLegal(num_iden).subscribe((data: any) => {
      this.lstRepresentantes = data.results;
      console.log(this.lstRepresentantes)
      if(this.lstRepresentantes.length != 0){
        //Booleano que controla el tipo de guardado
        this.representanteExiste = true;

        for(let representante of this.lstRepresentantes){
          //Booleano que controla el tipo de guardado
          this.representanteExiste = true;
          console.log(representante.id)
          this.representante_legal_id = representante.id;

          if(this.form.controls["cod_tipo_doc_identidad"].value.codigo == representante.cod_tipo_doc_identidad){
            this.form.controls['apellido_paterno'].disable();
            this.form.controls['apellido_materno'].disable();
            this.form.controls['nombre'].disable();

            this.form.controls['apellido_paterno'].setValue(representante.apellido_paterno);
            
            this.form.controls['apellido_materno'].setValue(representante.apellido_materno);
            this.form.controls['nombre'].setValue(representante.nombre);

            //this.form.controls["cod_tipo_doc_identidad"].setValue(this.representante[0].cod_tipo_doc_identidad);
            break;
              
          } else {
            //Booleano que controla el tipo de guardado
            this.representanteExiste = false;
            this.representante_legal_id = 0;

            console.log("Representantes con números de identificación coincidentes")
            this.form.controls['apellido_paterno'].enable();
            this.form.controls['apellido_materno'].enable();
            this.form.controls['nombre'].enable();
          }
        }
      } else{
        console.log("No se encontró al representante")
        //Booleano que controla el tipo de guardado
        this.representanteExiste = false;
        this.representante_legal_id = 0;

        this.form.controls['apellido_paterno'].enable();
        this.form.controls['apellido_materno'].enable();
        this.form.controls['nombre'].enable();
      }
      
    }, err => console.log(err));
  }


  getDepartamentos(){
    this.personaJuridicaService.getDepartamentos().subscribe((data: any) => {
      this.lstDepartamentos = data.results;
    }, err => console.log(err));
  }

  getProvincias(){
    let departamento=`${environment.apiUrl}/ubigeos/?codigo_depart=${this.form.controls['codigo_depart'].value.codigo_depart}
    &codigo_prov=&codigo_dist=00&page_size=100`;
    this.personaJuridicaService.getProvincias(departamento).subscribe((data: any) => {
      this.lstProvincias = data.results;
    }, err => console.log(err));
  }

  getDistritos(){
    let distrito=`${environment.apiUrl}/ubigeos/?codigo_depart=${this.form.controls['codigo_depart'].value.codigo_depart}
    &codigo_prov=${this.form.controls['codigo_prov'].value.codigo_prov}&codigo_dist=&page_size=100`;
    this.personaJuridicaService.getProvincias(distrito).subscribe((data: any) => {
      this.lstDistritos = data.results;
    }, err => console.log(err));
  }

  onChangeDepartamento() {
    if(this.form.controls['codigo_prov'].disabled){
      this.form.controls['codigo_prov'].enable();
    }
    else{
      this.form.controls['codigo_prov'].setValue('Seleccione una opción');
      this.form.controls['codigo_dist'].setValue('');
      this.form.controls['codigo_dist'].disable();
    } 
    this.getProvincias();
    this.getDistritos();
  }
  onChangeProvincia() {

    if(this.form.controls['codigo_dist'].disabled){
      this.form.controls['codigo_dist'].enable();
    }
    else{
      this.form.controls['codigo_dist'].setValue('Seleccione una opción');

    }
    this.getDistritos();

  }
  onChangeDistrito(){
    console.log(this.form.controls['codigo_dist'].value.codigo_ubigeo);
  }


  resetFields(){
    
    this.form.controls['fec_constitucion'].setValue("");
    this.form.controls['razon_social'].setValue("");
    this.form.controls['telefono_principal'].setValue("");
    this.form.controls['telefono_secundario'].setValue("");
    this.form.controls['correo_electronico'].setValue("");

    this.form.controls['codigo_depart'].setValue("");
    this.form.controls['codigo_prov'].setValue("");
    this.form.controls['codigo_dist'].setValue("");

    this.form.controls['cod_tipo_via'].setValue("");
    this.form.controls['domicilio'].setValue("");
    this.form.controls['nro_domicilio'].setValue("");
    this.form.controls['referencia_domicilio'].setValue("");

    this.form.controls['cod_tipo_doc_identidad'].setValue("");

    this.form.controls['num_documento_identidad'].setValue("");
    this.form.controls['apellido_paterno'].setValue("");
    this.form.controls['apellido_materno'].setValue("");
    this.form.controls['nombre'].setValue("");
  }

  btnAtras(){
    if (this.rusticoActive){      
      this.router.navigate(['predio/rustico']);
    } else {
      let data = {progreso_registro: 4};
      const id = localStorage.getItem("predio-urbano");
      this.predioService.updatePredio(id, data).subscribe(data=> {
        this.router.navigate(['predio/comun']);
      }, err => console.log(err));
    }
  }
}
