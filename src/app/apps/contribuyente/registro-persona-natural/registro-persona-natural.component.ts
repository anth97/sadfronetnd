import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { PersonaNaturalService } from "../../../core/service/contribuyente/contribuyente-persona-natural.service";
import { PersonaNatural } from "../../../core/interfaces/contribuyente/personaNatural.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import Swal from "sweetalert2";
import { getDateMeta } from "@fullcalendar/core";
import { PredioService } from "../../predio/services/predio.service";
import { environment } from "src/environments/environment";
import { ConsoleService } from "@ng-select/ng-select/lib/console.service";

@Component({
  selector: "app-registro-persona-natural",
  templateUrl: "./registro-persona-natural.component.html",
  styleUrls: ["./registro-persona-natural.component.sass"],
})
export class RegistroPersonaNaturalComponent implements OnInit {
  public results: Array<PersonaNatural> = [];
  public form: FormGroup;
  @Input() formPadre: FormGroup;
  public formSubmitted: boolean = false;

  rusticoActive: boolean = false;

  constructor(
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private activateRoute: ActivatedRoute,
    private personaNaturalService: PersonaNaturalService,
    private predioService: PredioService
  ) {
    this.activateRoute.queryParams.subscribe((params) => {
      console.log(params); // { from: "rustico" }

      if (params["from"] === "rustico") {
        this.rusticoActive = true;
      }

      console.log(this.rusticoActive); // true
    });
    this.initForm();
  }
  actualDate = new Date();

  personaNaturalExiste = false;
  contribuyenteExiste = false;
  conyugeExiste = false;

  personaNatural_id = 0;
  contribuyente_id = 0;
  conyuge_id = 0;



  existe = false;

  lstPersonasNaturales = [];
  lstConyuges = [];

  lstSearchUbigeo = [];
  lstDepartamentos = [];
  lstProvincias = [];
  lstDistritos = [];
  lstVias = [];
  lstSexo = [];
  lstEstadoCivil = [];
  lstDocumentos = [];
  lstDocumentosLength = [
    {
      codigo: "027001",
      length: 8,
    },
    {
      codigo: "027002",
      length: 12,
    },
    {
      codigo: "027003",
      length: 11,
    },
    {
      codigo: "027004",
      length: 12,
    },
    {
      codigo: "027005",
      length: 15,
    },
    {
      codigo: "027006",
      length: 15,
    },
  ];

  ngOnInit(): void {
    //this.getPersonaNatural();
    this.getDepartamentos();
    this.getTipoVias();
    this.getEstadoCivil();
    this.getSexo();
    this.getTipoDoc();
    this.form = this.fb.group({
      codigo_depart: ["", [Validators.required]],
      codigo_prov: ["", [Validators.required]],
      codigo_dist: ["", [Validators.required]],
      cod_tipo_via: ["", [Validators.required]],
      domicilio: ["", [Validators.required]],
      nro_domicilio: ["", [Validators.required]],
      referencia_domicilio: [""],
      telefono_principal: ["", [Validators.required, Validators.minLength(9)]],
      telefono_secundario: ["", [Validators.minLength(9)]],
      correo_electronico: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      //PersonaNatural
      nombre: ["", [Validators.required]],
      apellido_paterno: ["", [Validators.required]],
      apellido_materno: ["", [Validators.required]],
      cod_tipo_doc_identidad: ["", [Validators.required]],
      num_documento_identidad: ["", [Validators.required]],
      cod_sexo: ["", [Validators.required, Validators.maxLength(6)]],
      fec_nacimiento: ["", [Validators.required]],
      cod_estado_civil: ["", [Validators.required]],
      fec_reg: [
        this.datepipe.transform(this.actualDate, "yyyy-MM-dd HH:mm:ss"),
      ],
      fec_mod: [
        this.datepipe.transform(this.actualDate, "yyyy-MM-dd HH:mm:ss"),
      ],

      conyuge_apellido_paterno: ["", []],
      conyuge_apellido_materno: ["", []],
      conyuge_nombre: ["", []],
      conyuge_cod_tipo_doc_identidad: ["", []],
      conyuge_num_documento_identidad: ["", []],

      padre: this.fb.group({
        cod_tipo_cond_propiedad: ["", []],
        cod_tipo_uso: ["", []],
        porcentaje_condicion: ["", []],
      }),
      /* cod_tipo_cond_propiedad:['',[Validators.required]],
      porcentaje_condicion: ['',[Validators.required,Validators.maxLength(7)]], */
    });

    this.setValidations();

    this.form.controls["apellido_paterno"].disable();
    this.form.controls["apellido_materno"].disable();
    this.form.controls["nombre"].disable();
    this.form.controls["cod_sexo"].disable();
    this.form.controls["fec_nacimiento"].disable();
    this.form.controls["telefono_principal"].disable();
    this.form.controls["telefono_secundario"].disable();
    this.form.controls["correo_electronico"].disable();

    this.form.controls["codigo_depart"].disable();
    this.form.controls["codigo_prov"].disable();
    this.form.controls["codigo_dist"].disable();

    this.form.controls["cod_tipo_via"].disable();
    this.form.controls["domicilio"].disable();
    this.form.controls["nro_domicilio"].disable();
    this.form.controls["referencia_domicilio"].disable();
    this.form.controls["cod_estado_civil"].disable();

    this.form.controls["num_documento_identidad"].disable();

    this.form.controls["conyuge_num_documento_identidad"].disable();
    this.form.controls["conyuge_apellido_paterno"].disable();
    this.form.controls["conyuge_apellido_materno"].disable();
    this.form.controls["conyuge_nombre"].disable();
    
    
  }

  save() {
    console.log(this.personaNaturalExiste)
    console.log(this.contribuyenteExiste)
    console.log(this.conyugeExiste)
    if(
      this.personaNaturalExiste == false &&
      this.contribuyenteExiste == false &&
      this.conyugeExiste == false
    )
    {
      console.log("Nada existe")
      let conyuge = null;
      let usuario = localStorage.getItem("user");
      let usuarioJson = JSON.parse(usuario);
      let oPersonaNatural;
      if (this.form.controls["cod_estado_civil"].value.codigo == "010002") {
        //solo persona natural
        let cod_sexo_conyuge;
        if (this.form.controls["cod_sexo"].value.codigo == "024001") {
          cod_sexo_conyuge = "024002";
        } else if (this.form.controls["cod_sexo"].value.codigo == "024002") {
          cod_sexo_conyuge = "024001";
        } else {
          cod_sexo_conyuge = "024003";
        }
        oPersonaNatural = {
          contribuyente: {
            ubigeo: this.form.controls["codigo_dist"].value.codigo_ubigeo,
            cod_tipo_contribuyente: "026001",
            cod_tipo_via: this.form.controls["cod_tipo_via"].value.codigo,
            domicilio: this.form.controls["domicilio"].value,
            nro_domicilio: this.form.controls["nro_domicilio"].value,
            referencia_domicilio:
              this.form.controls["referencia_domicilio"].value,
            telefono_principal: this.form.controls["telefono_principal"].value,
            telefono_secundario:
              this.form.controls["telefono_secundario"].value,
            correo_electronico: this.form.controls["correo_electronico"].value,
            natural: {
              nombre: this.form.controls["nombre"].value,
              apellido_paterno: this.form.controls["apellido_paterno"].value,
              apellido_materno: this.form.controls["apellido_materno"].value,
              cod_tipo_doc_identidad:
                this.form.controls["cod_tipo_doc_identidad"].value.codigo,
              num_documento_identidad:
                this.form.controls["num_documento_identidad"].value,
              cod_sexo: this.form.controls["cod_sexo"].value.codigo,
              fec_nacimiento: this.form.controls["fec_nacimiento"].value,
              //109 serializer
              conyuge: {
                nombre: this.form.controls["conyuge_nombre"].value,
                apellido_paterno:
                  this.form.controls["conyuge_apellido_paterno"].value,
                apellido_materno:
                  this.form.controls["conyuge_apellido_materno"].value,
                cod_estado_civil:
                  this.form.controls["cod_estado_civil"].value.codigo,
                cod_tipo_doc_identidad:
                  this.form.controls["conyuge_cod_tipo_doc_identidad"].value
                    .codigo,
                num_documento_identidad:
                  this.form.controls["conyuge_num_documento_identidad"].value,
                cod_sexo: cod_sexo_conyuge,
              },
              cod_estado_civil:
                this.form.controls["cod_estado_civil"].value.codigo,
              fec_reg: this.form.controls["fec_reg"].value,
              fec_mod: this.form.controls["fec_mod"].value,
              usuario_mod_id: usuarioJson.id,
              usuario_reg_id: usuarioJson.id,
            },
          },
          //predio: localStorage.getItem("predio-urbano"),
          predio: 1,
          fec_inicio_vigencia: null,
          fec_fin_vigencia: null,
          cod_tipo_propietario: this.cod_tipo_propietario,
          porc_propiedad: this.porc_propiedad,
        };
      } else {
        oPersonaNatural = {
          contribuyente: {
            ubigeo: this.form.controls["codigo_dist"].value.codigo_ubigeo,
            cod_tipo_contribuyente: "026001",
            cod_tipo_via: this.form.controls["cod_tipo_via"].value.codigo,
            domicilio: this.form.controls["domicilio"].value,
            nro_domicilio: this.form.controls["nro_domicilio"].value,
            referencia_domicilio:
              this.form.controls["referencia_domicilio"].value,
            telefono_principal: this.form.controls["telefono_principal"].value,
            telefono_secundario:
              this.form.controls["telefono_secundario"].value,
            correo_electronico: this.form.controls["correo_electronico"].value,
            natural: {
              nombre: this.form.controls["nombre"].value,
              apellido_paterno: this.form.controls["apellido_paterno"].value,
              apellido_materno: this.form.controls["apellido_materno"].value,
              cod_tipo_doc_identidad:
                this.form.controls["cod_tipo_doc_identidad"].value.codigo,
              num_documento_identidad:
                this.form.controls["num_documento_identidad"].value,
              cod_sexo: this.form.controls["cod_sexo"].value.codigo,
              fec_nacimiento: this.form.controls["fec_nacimiento"].value,
              //109 serializer
              conyuge: null,
              cod_estado_civil:
                this.form.controls["cod_estado_civil"].value.codigo,
              fec_reg: this.form.controls["fec_reg"].value,
              fec_mod: this.form.controls["fec_mod"].value,
              usuario_mod_id: usuarioJson.id,
              usuario_reg_id: usuarioJson.id,
            },
          },
          predio: 1,
          fec_inicio_vigencia: null,
          fec_fin_vigencia: null,
          cod_tipo_propietario: this.cod_tipo_propietario,
          porc_propiedad: this.porc_propiedad,
        };
      }
      console.log(this.form.value);
      this.formSubmitted = true;
      if (!this.form.valid) {
        console.log("error");
      }
      console.log(this.form.value);
      console.log("Enviado");
      console.log(oPersonaNatural);
      this.personaNaturalService
        .create(oPersonaNatural)
        .subscribe((results) => {
          Swal.fire({
            text: "El Registro fue guardado exitosamente",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#55CA68",
          });
          this.router.navigate(["/contribuyente/registro-persona-natural"]);
        });
    }
    if(
      this.personaNaturalExiste == false &&
      this.contribuyenteExiste == false &&
      this.conyugeExiste == true 
    )
    {
      console.log("El conyuge existe")
      let conyuge = null;
      let usuario = localStorage.getItem("user");
      let usuarioJson = JSON.parse(usuario);
      let oPersonaNatural;
      if (this.form.controls["cod_estado_civil"].value.codigo == "010002") {
        //solo persona natural
        let cod_sexo_conyuge;
        if (this.form.controls["cod_sexo"].value.codigo == "024001") {
          cod_sexo_conyuge = "024002";
        } else if (this.form.controls["cod_sexo"].value.codigo == "024002") {
          cod_sexo_conyuge = "024001";
        } else {
          cod_sexo_conyuge = "024003";
        }
        oPersonaNatural = {
          contribuyente: {
            ubigeo: this.form.controls["codigo_dist"].value.codigo_ubigeo,
            cod_tipo_contribuyente: "026001",
            cod_tipo_via: this.form.controls["cod_tipo_via"].value.codigo,
            domicilio: this.form.controls["domicilio"].value,
            nro_domicilio: this.form.controls["nro_domicilio"].value,
            referencia_domicilio:
              this.form.controls["referencia_domicilio"].value,
            telefono_principal: this.form.controls["telefono_principal"].value,
            telefono_secundario:
              this.form.controls["telefono_secundario"].value,
            correo_electronico: this.form.controls["correo_electronico"].value,
            personanatural: {
              nombre: this.form.controls["nombre"].value,
              apellido_paterno: this.form.controls["apellido_paterno"].value,
              apellido_materno: this.form.controls["apellido_materno"].value,
              cod_tipo_doc_identidad:
                this.form.controls["cod_tipo_doc_identidad"].value.codigo,
              num_documento_identidad:
                this.form.controls["num_documento_identidad"].value,
              cod_sexo: this.form.controls["cod_sexo"].value.codigo,
              fec_nacimiento: this.form.controls["fec_nacimiento"].value,
              //109 serializer
              conyuge: this.conyuge_id,
              cod_estado_civil:
                this.form.controls["cod_estado_civil"].value.codigo,
              fec_reg: this.form.controls["fec_reg"].value,
              fec_mod: this.form.controls["fec_mod"].value,
              usuario_mod_id: usuarioJson.id,
              usuario_reg_id: usuarioJson.id,
            },
          },
          predio: 1,
          cod_tipo_uso: this.cod_tipo_uso,
          fec_inicio_vigencia: null,
          fec_fin_vigencia: null,
          cod_tipo_propietario: this.cod_tipo_propietario,
          porc_propiedad: this.porc_propiedad,
        };
      } else {
        oPersonaNatural = {
          contribuyente: {
            ubigeo: this.form.controls["codigo_dist"].value.codigo_ubigeo,
            cod_tipo_contribuyente: "026001",
            cod_tipo_via: this.form.controls["cod_tipo_via"].value.codigo,
            domicilio: this.form.controls["domicilio"].value,
            nro_domicilio: this.form.controls["nro_domicilio"].value,
            referencia_domicilio:
              this.form.controls["referencia_domicilio"].value,
            telefono_principal: this.form.controls["telefono_principal"].value,
            telefono_secundario:
              this.form.controls["telefono_secundario"].value,
            correo_electronico: this.form.controls["correo_electronico"].value,
            personanatural: {
              nombre: this.form.controls["nombre"].value,
              apellido_paterno: this.form.controls["apellido_paterno"].value,
              apellido_materno: this.form.controls["apellido_materno"].value,
              cod_tipo_doc_identidad:
                this.form.controls["cod_tipo_doc_identidad"].value.codigo,
              num_documento_identidad:
                this.form.controls["num_documento_identidad"].value,
              cod_sexo: this.form.controls["cod_sexo"].value.codigo,
              fec_nacimiento: this.form.controls["fec_nacimiento"].value,
              //109 serializer
              conyuge: null,
              cod_estado_civil:
                this.form.controls["cod_estado_civil"].value.codigo,
              fec_reg: this.form.controls["fec_reg"].value,
              fec_mod: this.form.controls["fec_mod"].value,
              usuario_mod_id: usuarioJson.id,
              usuario_reg_id: usuarioJson.id,
            },
          },
          predio: 1,
          cod_tipo_uso: this.cod_tipo_uso,
          fec_inicio_vigencia: null,
          fec_fin_vigencia: null,
          cod_tipo_propietario: this.cod_tipo_propietario,
          porc_propiedad: this.porc_propiedad,
        };
      }
      console.log(this.form.value);
      this.formSubmitted = true;
      if (!this.form.valid) {
        console.log("error");
      }
      console.log(this.form.value);
      console.log("Enviado");
      console.log(oPersonaNatural);
      this.personaNaturalService
        .createTwo(oPersonaNatural)
        .subscribe((results) => {
          Swal.fire({
            text: "El Registro fue guardado exitosamente",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#55CA68",
          });
          this.router.navigate(["/contribuyente/registro-persona-natural"]);
        });
    }
    if(
      this.personaNaturalExiste == true &&
      this.contribuyenteExiste == false
    )
    {
      console.log("La persona natural existe")

      let usuario = localStorage.getItem("user");
      let usuarioJson = JSON.parse(usuario);
      let oPersonaNatural;
      oPersonaNatural = {
        contribuyente: {
          ubigeo: this.form.controls["codigo_dist"].value.codigo_ubigeo,
          cod_tipo_contribuyente: "026001",
          cod_tipo_via: this.form.controls["cod_tipo_via"].value.codigo,
          domicilio: this.form.controls["domicilio"].value,
          nro_domicilio: this.form.controls["nro_domicilio"].value,
          referencia_domicilio:
            this.form.controls["referencia_domicilio"].value,
          telefono_principal: this.form.controls["telefono_principal"].value,
          telefono_secundario:
            this.form.controls["telefono_secundario"].value,
          correo_electronico: this.form.controls["correo_electronico"].value,
          personanatural: this.personaNatural_id,
        },
        predio: 1,
        cod_tipo_uso: this.cod_tipo_uso,
        fec_inicio_vigencia: null,
        fec_fin_vigencia: null,
        cod_tipo_propietario: this.cod_tipo_propietario,
        porc_propiedad: this.porc_propiedad,
      };
      console.log(this.form.value);
      this.formSubmitted = true;
      if (!this.form.valid) {
        console.log("error");
      }
      console.log(this.form.value);
      console.log("Enviado");
      console.log(oPersonaNatural);
      this.personaNaturalService
        .createThree(oPersonaNatural)
        .subscribe((results) => {
          Swal.fire({
            text: "El Registro fue guardado exitosamente",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#55CA68",
          });
          this.router.navigate(["/contribuyente/registro-persona-natural"]);
        });
    }
    if(
      this.personaNaturalExiste == true &&
      this.contribuyenteExiste == true &&
      this.conyugeExiste == true
    )
    {
      console.log("Todo existe")
      let usuario = localStorage.getItem("user");
      let usuarioJson = JSON.parse(usuario);
      let oPersonaNatural;
      oPersonaNatural = {
        contribuyente: this.contribuyente_id,
        predio: 1,
        cod_tipo_uso: this.cod_tipo_uso,
        fec_inicio_vigencia: null,
        fec_fin_vigencia: null,
        cod_tipo_propietario: this.cod_tipo_propietario,
        porc_propiedad: this.porc_propiedad,
      };
      console.log(this.form.value);
      this.formSubmitted = true;
      if (!this.form.valid) {
        console.log("error");
      }
      console.log(this.form.value);
      console.log("Enviado");
      console.log(oPersonaNatural);
      this.personaNaturalService
        .createFour(oPersonaNatural)
        .subscribe((results) => {
          Swal.fire({
            text: "El Registro fue guardado exitosamente",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#55CA68",
          });
          this.router.navigate(["/contribuyente/registro-persona-natural"]);
        });
    }
  }
  length = 0;
  conyugeLength = 0;
  ready = false;
  fec_nacimiento: Date;
  s_num_documento_identidad: String = "";
  conyuge_cod_tipo_doc_identidad;
  s_conyuge_num_documento_identidad: String = "";
  hide = true;
  @Input() cod_tipo_propietario = "";
  @Input() cod_tipo_uso = "";
  @Input() porc_propiedad = "";
  
  initForm() {}

  getTipoVias() {
    this.personaNaturalService.getTipoVia().subscribe(
      (data: any) => {
        this.lstVias = data;
      },
      (err) => console.log(err)
    );
  }
  getDepartamentos() {
    this.personaNaturalService.getDepartamentos().subscribe(
      (data: any) => {
        this.lstDepartamentos = data.results;
      },
      (err) => console.log(err)
    );
  }
  getProvincias(codigo_depart:string) {
    //this.form.controls["codigo_depart"].value.codigo_depart
    let departamento = `${environment.apiUrl}/ubigeos/?codigo_depart=${codigo_depart}
    &codigo_prov=&codigo_dist=00&page_size=100`;
    this.personaNaturalService.getProvincias(departamento).subscribe(
      (data: any) => {
        this.lstProvincias = data.results;
      },
      (err) => console.log(err)
    );
  }

  getDistritos(codigo_depart:string, codigo_prov:string) {
    //this.form.controls["codigo_depart"].value.codigo_depart
    //this.form.controls["codigo_prov"].value.codigo_prov
    let distrito = `${environment.apiUrl}/ubigeos/?codigo_depart=${codigo_depart}
    &codigo_prov=${codigo_prov}&codigo_dist=&page_size=100`;
    this.personaNaturalService.getDistritos(distrito).subscribe(
      (data: any) => {
        this.lstDistritos = data.results;
      },
      (err) => console.log(err)
    );
  }

  getSexo() {
    this.personaNaturalService.getSexo().subscribe(
      (data: any) => {
        this.lstSexo = data;
      },
      (err) => console.log(err)
    );
  }
  getEstadoCivil() {
    this.personaNaturalService.getEstadoCivil().subscribe(
      (data: any) => {
        this.lstEstadoCivil = data;
      },
      (err) => console.log(err)
    );
  }
  getTipoDoc() {
    this.personaNaturalService.getTipoDoc().subscribe(
      (data: any) => {
        this.lstDocumentos = data;
      },
      (err) => console.log(err)
    );
  }

  setValidations() {
    if (this.form.controls["cod_estado_civil"].value != null) {
      const conyuge_apellido_paterno = this.form.get(
        "conyuge_apellido_paterno"
      );
      const conyuge_apellido_materno = this.form.get(
        "conyuge_apellido_materno"
      );
      const conyuge_nombre = this.form.get("conyuge_nombre");
      const conyuge_cod_tipo_doc_identidad = this.form.get(
        "conyuge_cod_tipo_doc_identidad"
      );
      const conyuge_num_documento_identidad = this.form.get(
        "conyuge_num_documento_identidad"
      );

      this.form
        .get("cod_estado_civil")
        .valueChanges.subscribe((cod_estado_civil) => {
          if (cod_estado_civil.codigo === "010002") {
            conyuge_apellido_paterno.setValidators([Validators.required]);
            conyuge_apellido_materno.setValidators([Validators.required]);
            conyuge_nombre.setValidators([Validators.required]);
            conyuge_cod_tipo_doc_identidad.setValidators([Validators.required]);
            conyuge_num_documento_identidad.setValidators([
              Validators.required,
            ]);
          } else {
            conyuge_apellido_paterno.setValidators(null);
            conyuge_apellido_materno.setValidators(null);
            conyuge_nombre.setValidators(null);
            conyuge_cod_tipo_doc_identidad.setValidators(null);
            conyuge_num_documento_identidad.setValidators(null);
          }

          conyuge_apellido_paterno.updateValueAndValidity();
          conyuge_apellido_materno.updateValueAndValidity();
          conyuge_nombre.updateValueAndValidity();
          conyuge_cod_tipo_doc_identidad.updateValueAndValidity();
          conyuge_num_documento_identidad.updateValueAndValidity();
        });
    }
  }

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Only AlphaNumeric with Some Characters [-_ ]
  keyPressAlphaNumericWithCharacters(event) {
    var inp = String.fromCharCode(event.keyCode);
    // Allow numbers, alpahbets, space, underscore
    if (/[a-zA-ñÑáéíóúÁÉÍÓÚ ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  list() {
    this.personaNaturalService
      .list()
      .subscribe((results) => (this.results = results));
  }

  btnAtras() {
    if (this.rusticoActive) {
      this.router.navigate(["predio/rustico"]);
    } else {
      let data = { progreso_registro: 4 };
      const id = localStorage.getItem("predio-urbano");
      this.predioService.updatePredio(id, data).subscribe(
        (data) => {
          this.router.navigate(["predio/comun"]);
        },
        (err) => console.log(err)
      );
    }
  }

  openModal(content) {
    this.modalService.open(content, { centered: true });
    console.log(content);
  }

  onChangeDocumento() {
    this.s_num_documento_identidad = "";
    for (let length of this.lstDocumentosLength) {
      if (
        length.codigo ==
        this.form.controls["cod_tipo_doc_identidad"].value.codigo
      ) {
        this.length = length.length;
      }
    }
    this.form.controls["num_documento_identidad"].enable();
    console.log("Cambio");
    console.log(this.length);
  }
  onChangeConyuge() {
    this.s_conyuge_num_documento_identidad = "";
    for (let length of this.lstDocumentosLength) {
      if (length.codigo == this.conyuge_cod_tipo_doc_identidad.codigo) {
        this.conyugeLength = length.length;
      }
    }
    
    this.form.controls["conyuge_num_documento_identidad"].enable();
    console.log(this.conyuge_cod_tipo_doc_identidad);
  }
  onChangeEstado() {
    console.log(this.form.controls["cod_estado_civil"].value.codigo);
    this.form.controls["conyuge_cod_tipo_doc_identidad"].enable();
  }
  onChangeVia() {
    console.log(this.form.controls["cod_tipo_via"].value);
  }
  onChangeFecha() {
    console.log(this.form.controls["fec_nacimiento"].value);
  }
  onRegister() {
    console.log("Form Value", this.form.value);
  }
  onChangeDepartamento() {
    if (this.form.controls["codigo_prov"].disabled) {
      this.form.controls["codigo_prov"].enable();
    } else {
      this.form.controls["codigo_prov"].reset();
      this.form.controls["codigo_prov"].setValue("Seleccione una opción");
      this.form.controls["codigo_dist"].setValue("");
      this.form.controls["codigo_dist"].disable();
    }
    this.getProvincias(this.form.controls["codigo_depart"].value.codigo_depart);
    this.getDistritos(this.form.controls["codigo_depart"].value.codigo_depart,
    this.form.controls["codigo_prov"].value.codigo_prov);
    console.log(this.form.controls["codigo_depart"])
    
  }
  onChangeProvincia() {
    if (this.form.controls["codigo_dist"].disabled) {
      this.form.controls["codigo_dist"].enable();
    } else {
      this.form.controls["codigo_dist"].setValue("Seleccione una opción");
    }
    this.getDistritos(this.form.controls["codigo_depart"].value.codigo_depart,
    this.form.controls["codigo_prov"].value.codigo_prov);
  }
  onChangeDistrito() {
    console.log(this.form.controls["codigo_dist"].value.codigo_ubigeo);
  }


  searchPersonaNatural() {
    this.getTipoDoc();
    this.getTipoVias();
    this.getDepartamentos();

    this.resetFields();

    this.personaNaturalExiste = false;
    this.contribuyenteExiste = false;
    this.conyugeExiste = false;

    console.log(this.s_num_documento_identidad);
    if (this.s_num_documento_identidad == "") {
      console.log("Escriba algo");
    } else {
      if (this.length == this.s_num_documento_identidad.length) {
        console.log("Buscando a la persona");
        console.log(this.lstPersonasNaturales);

        this.getPersonaNatural(this.s_num_documento_identidad);
      } else {
        console.log("número de dígitos inválido");
      }
    }
  }
  getPersonaNatural(doc_iden: String) {
    this.personaNaturalService.getPersonaNatural(doc_iden).subscribe(
      (data: any) => {
        this.lstPersonasNaturales = data.results;

        console.log(this.lstPersonasNaturales);

        if (this.lstPersonasNaturales.length != 0) {
          //Booleano que controla el tipo de guardado
          this.personaNaturalExiste = true;

          for (let persona of this.lstPersonasNaturales) {
            //Booleano que controla el tipo de guardado
            this.existe = true;
            this.personaNatural_id = persona.id;
            console.log(persona.id)
            if (
              this.form.controls["cod_tipo_doc_identidad"].value.codigo ==
              persona.cod_tipo_doc_identidad
            ) {

              this.form.controls["apellido_paterno"].disable();
              this.form.controls["apellido_materno"].disable();
              this.form.controls["nombre"].disable();

              if(persona.cod_sexo != null){
                this.form.controls["cod_sexo"].disable();
              } else {
                this.form.controls["cod_sexo"].enable();
              }
              if(persona.fec_nacimiento != null){
                this.form.controls["fec_nacimiento"].disable();
              } else {
                this.form.controls["fec_nacimiento"].enable();
              }

              this.form.controls["cod_estado_civil"].disable();


              this.form.controls["nombre"].setValue(persona.nombre);
              this.form.controls["apellido_paterno"].setValue(
                persona.apellido_paterno
              );
              this.form.controls["apellido_materno"].setValue(
                persona.apellido_materno
              );
              for (let tipoDoc of this.lstDocumentos){
                if(tipoDoc.codigo==persona.cod_tipo_doc_identidad){
                  this.form.controls["cod_tipo_doc_identidad"].setValue(tipoDoc);
                  console.log(this.form.controls["cod_tipo_doc_identidad"])
                  break;
                }
              };
              for (let sexo of this.lstSexo){
                if(sexo.codigo==persona.cod_sexo){
                  this.form.controls["cod_sexo"].setValue(sexo);
                  break;
                }
              };
              if (persona.fec_nacimiento != null) {
                var fecha = persona.fec_nacimiento;
                this.form.controls["fec_nacimiento"].setValue(
                  fecha.substring(0, 10)
                );
              } else {
                this.form.controls["fec_nacimiento"].setValue(null);
              };

              for (let estadoCivil of this.lstEstadoCivil){
                if(estadoCivil.codigo==persona.cod_estado_civil){
                  this.form.controls["cod_estado_civil"].setValue(estadoCivil);
                  if(persona.cod_estado_civil ==  '010002'){
                    this.form.controls["conyuge_cod_tipo_doc_identidad"].disable();
                  }
                  break;
                }
              };

              //this.form.controls['cod_contribuyente'].setValue(persona.contribuyente.cod_contribuyente);
              //this.form.controls['cod_tipo_contribuyente'].setValue(persona.contribuyente.cod_tipo_contribuyente);
              if (persona.contribuyente != null) {
                //Booleano que controla el tipo de guardado
                this.contribuyenteExiste = true;
                this.contribuyente_id = persona.contribuyente.id
                console.log(persona.contribuyente.id)

                this.form.controls["telefono_principal"].disable();
                this.form.controls["telefono_secundario"].disable();
                this.form.controls["correo_electronico"].disable();
                this.form.controls["codigo_depart"].disable();
                this.form.controls["codigo_prov"].disable();
                this.form.controls["codigo_dist"].disable();
                this.form.controls["cod_tipo_via"].disable();
                this.form.controls["domicilio"].disable();
                this.form.controls["nro_domicilio"].disable();
                this.form.controls["referencia_domicilio"].disable();


                for (let via of this.lstVias){
                  if(via.codigo==persona.contribuyente.cod_tipo_via){
                    this.form.controls["cod_tipo_via"].setValue(
                      via
                      );
                    break;
                  }
                }

                for (let departamento of this.lstDepartamentos){
                  
                  if(departamento.codigo==persona.contribuyente.codigo_depart){

                    this.form.controls["codigo_depart"].setValue(departamento);
                    break;
                  }
                };

                var departamento = persona.contribuyente.ubigeo.substring(0, 2)
                var provincia = persona.contribuyente.ubigeo.substring(2, 4)
                var distrito = persona.contribuyente.ubigeo.substring(4, 6)

                this.personaNaturalService.searchDepartamento(departamento, "00", "00").subscribe(
                  (data: any) => {
                    this.lstDepartamentos = data.results;
                    this.form.controls["codigo_depart"].setValue(this.lstDepartamentos[0]);

                    this.personaNaturalService.searchDepartamento(departamento, provincia, "00").subscribe(
                      (data: any) => {
                        this.lstProvincias = data.results;
                        this.form.controls["codigo_prov"].setValue(this.lstProvincias[0]);

                        this.personaNaturalService.searchDepartamento(departamento, provincia, distrito).subscribe(
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

                this.form.controls["domicilio"].setValue(
                  persona.contribuyente.domicilio
                );
                this.form.controls["nro_domicilio"].setValue(
                  persona.contribuyente.nro_domicilio
                );
                this.form.controls["referencia_domicilio"].setValue(
                  persona.contribuyente.referencia_domicilio
                );
                this.form.controls["telefono_principal"].setValue(
                  persona.contribuyente.telefono_principal
                );
                this.form.controls["telefono_secundario"].setValue(
                  persona.contribuyente.telefono_secundario
                );
                this.form.controls["correo_electronico"].setValue(
                  persona.contribuyente.correo_electronico
                );
              } else {
                console.log("La persona natural no es contribuyente");
                //Bolleano que controla el tipo de guardado
                this.contribuyenteExiste = false;
                this.contribuyente_id = 0;

                //Solo si se desea editar a la persona natural
                this.form.controls["telefono_principal"].enable();
                this.form.controls["telefono_secundario"].enable();
                this.form.controls["correo_electronico"].enable();
                this.form.controls["codigo_depart"].enable();

                this.form.controls["cod_tipo_via"].enable();
                this.form.controls["domicilio"].enable();
                this.form.controls["nro_domicilio"].enable();
                this.form.controls["referencia_domicilio"].enable();

              }


              if(persona.conyuge != null){
                //Bolleano que controla el tipo de guardado
                this.conyugeExiste = true;
                this.conyuge_id = persona.conyuge.id
                console.log(persona.conyuge.id)

                //this.form.controls["conyuge_cod_tipo_doc_identidad"].disable();
                this.form.controls["conyuge_num_documento_identidad"].disable();
                this.form.controls["conyuge_apellido_paterno"].disable();
                this.form.controls["conyuge_apellido_materno"].disable();
                this.form.controls["conyuge_nombre"].disable();

                this.form.controls["conyuge_nombre"].setValue(
                  persona.conyuge.nombre
                );
                this.form.controls["conyuge_apellido_paterno"].setValue(
                  persona.conyuge.apellido_paterno
                );
                this.form.controls["conyuge_apellido_materno"].setValue(
                  persona.conyuge.apellido_materno
                );

                this.form.controls["conyuge_num_documento_identidad"].setValue(
                  persona.conyuge.num_documento_identidad
                );
                this.s_conyuge_num_documento_identidad = persona.conyuge.num_documento_identidad;

                for (let tipoDoc of this.lstDocumentos){
                  if(tipoDoc.codigo==persona.conyuge.cod_tipo_doc_identidad){
                    this.conyuge_cod_tipo_doc_identidad = tipoDoc;
                    this.form.controls["conyuge_cod_tipo_doc_identidad"].setValue(tipoDoc);
                    break;
                  }
                };

                

              } else {

                console.log("No cuenta con un/una cónyuge")
                
                //Bolleano que controla el tipo de guardado
                this.conyugeExiste = false;
                this.conyuge_id = 0;
                
                if(persona.cod_estado_civil !=null){
                  for (let estadoCivil of this.lstEstadoCivil){
                    if(estadoCivil.codigo==persona.cod_estado_civil){
                      this.form.controls["cod_estado_civil"].setValue(estadoCivil);
                      if(persona.cod_estado_civil ==  '010002'){
                        this.form.controls["conyuge_cod_tipo_doc_identidad"].disable();
                      }
                      break;
                    }
                  };
                } else {
                  this.form.controls["conyuge_cod_tipo_doc_identidad"].enable()
                  this.form.controls["cod_estado_civil"].enable()
                  
                }
                
              }

              break;
            } else {
              console.log("No se encontró a la persona natural");
              //Booleano que controla el tipo de guardado
              this.existe = false;
              this.personaNatural_id = 0;
              //Solo si se desea editar
              this.form.controls["apellido_paterno"].enable();
              this.form.controls["apellido_materno"].enable();
              this.form.controls["nombre"].enable();
              this.form.controls["cod_sexo"].enable();
              this.form.controls["fec_nacimiento"].enable();
              this.form.controls["telefono_principal"].enable();
              this.form.controls["telefono_secundario"].enable();
              this.form.controls["correo_electronico"].enable();

              this.form.controls["codigo_depart"].enable();

              this.form.controls["cod_tipo_via"].enable();
              this.form.controls["domicilio"].enable();
              this.form.controls["nro_domicilio"].enable();
              this.form.controls["referencia_domicilio"].enable();
              this.form.controls["cod_estado_civil"].enable();
            }
          }
        } else {
          console.log("No se encontró alguna persona natural");
          //Booleano que controla el tipo de guardado
          this.existe = false;
          this.personaNatural_id = 0;

          this.form.controls["apellido_paterno"].enable();
          this.form.controls["apellido_materno"].enable();
          this.form.controls["nombre"].enable();
          this.form.controls["cod_sexo"].enable();
          this.form.controls["fec_nacimiento"].enable();
          this.form.controls["telefono_principal"].enable();
          this.form.controls["telefono_secundario"].enable();
          this.form.controls["correo_electronico"].enable();

          this.form.controls["codigo_depart"].enable();

          this.form.controls["cod_tipo_via"].enable();
          this.form.controls["domicilio"].enable();
          this.form.controls["nro_domicilio"].enable();
          this.form.controls["referencia_domicilio"].enable();
          this.form.controls["cod_estado_civil"].enable();
        }
      },
      (err) => console.log(err)
    );
  }

  searchConyuge() {
    console.log(this.s_conyuge_num_documento_identidad);
    if (this.s_conyuge_num_documento_identidad == "") {
      console.log("Escriba algo");
    } else {
      if (this.conyugeLength == this.s_conyuge_num_documento_identidad.length) {
        console.log("Buscando al conyuge");

        this.getConyuge(this.s_conyuge_num_documento_identidad);
      } else {
        console.log("número de dígitos inválido");
      }
    }
  }
  getConyuge(doc_iden: String) {
    this.personaNaturalService.getPersonaNatural(doc_iden).subscribe(
      (data: any) => {
        this.lstConyuges = data.results;

        console.log(this.lstConyuges);
        if (this.lstConyuges.length != 0) {
          //Booleano que controla el tipo de guardado
          this.conyugeExiste = true;
          for (let conyuge of this.lstConyuges) {
            //Booleano que controla el tipo de guardado
            this.conyugeExiste = true;
            this.conyuge_id = conyuge.id;
            console.log(conyuge.id);
            if (
              this.form.controls["conyuge_cod_tipo_doc_identidad"].value
                .codigo == conyuge.cod_tipo_doc_identidad
            ) {

              this.form.controls["conyuge_apellido_paterno"].disable();
              this.form.controls["conyuge_apellido_materno"].disable();
              this.form.controls["conyuge_nombre"].disable();

              this.form.controls["conyuge_nombre"].setValue(conyuge.nombre);
              this.form.controls["conyuge_apellido_paterno"].setValue(
                conyuge.apellido_paterno
              );
              this.form.controls["conyuge_apellido_materno"].setValue(
                conyuge.apellido_materno
              );

              for (let tipoDoc of this.lstDocumentos){
                console.log(tipoDoc)
                console.log(conyuge.cod_tipo_doc_identidad)
                if(tipoDoc.codigo==conyuge.cod_tipo_doc_identidad){
                  console.log(tipoDoc)
                  this.form.controls["conyuge_cod_tipo_doc_identidad"].setValue(tipoDoc);
                  console.log(this.form.controls["conyuge_cod_tipo_doc_identidad"])
                  break;
                }
              };
              this.form.controls["conyuge_num_documento_identidad"].setValue(
                conyuge.num_documento_identidad
              );

            } else {
              console.log("No se encontró al conyuge");
              //Booleano que controla el tipo de guardado
              this.conyugeExiste = false;
              this.conyuge_id = 0;

              this.form.controls["conyuge_apellido_paterno"].enable();
              this.form.controls["conyuge_apellido_materno"].enable();
              this.form.controls["conyuge_nombre"].enable();
            }
          }
        } else {
          console.log("No se encontró algún conyuge");
          //Booleano que controla el tipo de guardado
          this.conyugeExiste = false;
          this.conyuge_id = 0;

          this.form.controls["conyuge_apellido_paterno"].enable();
          this.form.controls["conyuge_apellido_materno"].enable();
          this.form.controls["conyuge_nombre"].enable();
        }
      },
      (err) => console.log(err)
    );
  }
  resetFields(){

    this.form.controls["apellido_paterno"].setValue("");
    this.form.controls["apellido_materno"].setValue("");
    this.form.controls["nombre"].setValue("");
    this.form.controls["cod_sexo"].setValue("");
    this.form.controls["fec_nacimiento"].setValue("");
    this.form.controls["telefono_principal"].setValue("");
    this.form.controls["telefono_secundario"].setValue("");
    this.form.controls["correo_electronico"].setValue("");

    this.form.controls["codigo_depart"].setValue("");
    this.form.controls["codigo_prov"].setValue("");
    this.form.controls["codigo_dist"].setValue("");

    this.form.controls["cod_tipo_via"].setValue("");
    this.form.controls["domicilio"].setValue("");
    this.form.controls["nro_domicilio"].setValue("");
    this.form.controls["referencia_domicilio"].setValue("");
    this.form.controls["cod_estado_civil"].setValue("");

    this.form.controls["conyuge_cod_tipo_doc_identidad"].setValue("");
    this.form.controls["conyuge_num_documento_identidad"].setValue("");
    this.form.controls["conyuge_apellido_paterno"].setValue("");
    this.form.controls["conyuge_apellido_materno"].setValue("");
    this.form.controls["conyuge_nombre"].setValue("");

  }
}
