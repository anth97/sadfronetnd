import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdministrarCajaService } from "../../../core/service/caja/administrar-caja.service";
import { NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { MatDialog } from "@angular/material/dialog";
import { CajaModalComponent } from "./caja-modal/caja-modal.component";
import { DatePipe } from "@angular/common";
import Swal from 'sweetalert2';

@Component({
  selector: "app-administrar-caja",
  templateUrl: "./administrar-caja.component.html",
  styleUrls: ["./administrar-caja.component.sass"],
})
export class AdministrarCajaComponent implements OnInit {
  public formAperturar: FormGroup;
  public formCerrar: FormGroup;
  constructor(
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private AdministrarCajaService: AdministrarCajaService,
    public dialog: MatDialog
  ) {}

  actualDate = new Date();
  lstDenominaciones = [
    "200.00",
    "100.00",
    "50.00",
    "20.00",
    "10.00",
    "5.00",
    "2.00",
    "1.00",
    "0.50",
    "0.20",
    "0.10",
  ];
  lstCantidades = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
  lstSubTotales = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
  lstCantidadesCaja = [ ];
  lstCantidadesCajaCerrar = [ ];

  lstCajeros = [];
  lstCajerosDisponibles = [];

  lstCajas = [];  
  lstCajasDisponibles = [];
  lstCajasActivas = [];
  lstCajasAsignadas = [];


  lstGrilla = [];
  totalGrilla = 0;
  totalGrillaCerrar = 0;
  totalMontoCaja = 0;

  active;

  cajeroCerrar;

  cantidad;
  ngOnInit(): void {
    this.formAperturar = this.fb.group({
      cod_caja: ["", [Validators.required]],
      cod_cajero: ["", [Validators.required]],
      monto_transferir: ["", [Validators.required]],
    });
    this.formCerrar = this.fb.group({
      cod_cajaCerrar: ["", [Validators.required]],
      cod_cajeroCerrar: ["", []],
      num_cheques: ["", []],
      monto_cheque: ["", []],
      num_operaciones_electronicas: ["", []],
      monto_operaciones_electronicas: ["", []],
      monto_transferirCerrar: ["",[] ],
      monto_caja: ["", []],
    });
    this.getCajas();
    
  }
  calcularSubTotal(denominacion: number, cantidad: number, id: number) {
    let subTotal = denominacion * cantidad;
    if (isNaN(subTotal)) {
      subTotal = 0;
    }
    this.lstSubTotales[id] = String(subTotal);

    return subTotal;
  }
  onRegisterAperturar() {
    console.log("Form Value", this.formAperturar.value);
  }
  onRegisterCerrar() {
    console.log("Form Value", this.formCerrar.value);
  }
  InputNumberDecimal(evt) {
    let key = false;
    var ch = String.fromCharCode(evt.which);
    if (!/^\d*\.?\d*$/.test(ch)) {
      evt.preventDefault();
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

  getCajas() {
    this.lstCajas = [ ];
    this.AdministrarCajaService.getCajas().subscribe(
      (data: any) => {
        this.lstCajas = data.results;
        this.getCajasAsignadasAbiertas();
      },
      (err) => console.log(err)
    );
  }

  getCajasAsignadasAbiertas(){
    this.lstGrilla = [];
    this.AdministrarCajaService.getCajasAsignadasAbiertas().subscribe(
      (data: any) => {
        this.lstCajasAsignadas = data.results;
        for (let cajaAsignada of this.lstCajasAsignadas) {
          if (cajaAsignada.fec_cierre == null) {
            let grillaItem = {
              apertura: cajaAsignada.fec_asignacion,
              caja: cajaAsignada.caja.nombre,
              caja_id: cajaAsignada.caja.id,
              cajero: cajaAsignada.user_cajero.last_name +", "+ cajaAsignada.user_cajero.first_name,
              monto: cajaAsignada.monto_actual,
            };
            this.lstGrilla.push(grillaItem);
          }
        }

        this.getCajerosDisponibles();
      },
      
      (err) => console.log(err)
    );
  }
  
  getCajerosDisponibles() {
    this.lstCajeros = [ ];
    this.lstCajerosDisponibles = [ ];
    this.AdministrarCajaService.getUsers().subscribe(
      (data: any) => {
        for (let cajero of data.results){
          if(cajero.username.includes('cajero')){
            this.lstCajeros.push(cajero);
            this.lstCajerosDisponibles.push(cajero);
          }
        }
        for (let caja of this.lstCajasAsignadas){
          for(let cajero of this.lstCajerosDisponibles){
            if(caja.user_cajero.id == cajero.id){
              this.lstCajerosDisponibles.splice(
                this.lstCajerosDisponibles.indexOf(cajero, 0),1
              );
            }
          }
        }

      },
      (err) => console.log(err)
    );
  }
  

  abrirCaja() {
    this.crearCajaAsignada();
  }

  crearCajaAsignada(){
    let asignacion = 1; //Preguntar como hacerlo
    let data = {
      codigo_estado_caja: "009001",
    };
    let usuario = localStorage.getItem("user");
    let usuarioJson = JSON.parse(usuario);
    
    let lstUpdateCantidades = [];
        
    for(let index in this.lstCantidadesCaja){
      let oCaja = {
        "denominacion_moneda": 11-Number(index),
        "cantidad": Number(this.lstCantidadesCaja[index])
      }
      lstUpdateCantidades.push(oCaja);
    }
    

    let oCajaAsignada = {
      caja: this.formAperturar.controls["cod_caja"].value.id,
      user_apertura: usuarioJson.id,
      user_cierre: null,
      user_cajero: this.formAperturar.controls["cod_cajero"].value.id,
      num_asignacion: asignacion,
      monto_actual: this.formAperturar.controls["monto_transferir"].value,
      monto_apertura: this.formAperturar.controls["monto_transferir"].value,
      monto_cierre: null,
      monto_tarjeta_cierre: null,
      monto_cheque_cierre: null,
      monto_total_cierre: null,
      num_pago_efectivo: null,
      num_pago_tarjeta: null,
      num_pago_cheque: null,
      num_extornos: null,
      fec_cierre: null,
      fec_cierre_real: null,
      movimientoboveda_set:{
        boveda: 1,
        cod_tipo_movimiento_boveda: "029003",
        monto: this.formAperturar.controls["monto_transferir"].value,
        detallemovimientoboveda_set:lstUpdateCantidades
      },
      operacion_set:{
        cod_forma_pago: "016001",
        cod_tipo_movimiento_caja:"030001",
        monto_operacion: this.formAperturar.controls["monto_transferir"].value,
        monto_operacion_con_redondeo: Math.floor(this.formAperturar.controls["monto_transferir"].value),
        es_extorno: false
      }      
    };
    this.AdministrarCajaService.createCajaAsignada(oCajaAsignada).subscribe((results) => {
      /* this.crearMovimientoBoveda(results.id, results.monto_actual, "029003"); */
      this.AdministrarCajaService.updateCaja(
        this.formAperturar.controls["cod_caja"].value.id,
        data
      ).subscribe(
        (res) => {
          
          Swal.fire({
            icon: 'success',
            title: 'Registro actualizado correctamente',
            confirmButtonColor: '#8963ff',
            confirmButtonText: 'Entendido',
          })
          this.formAperturar.reset();
          this.getCajas();
          this.lstCantidadesCaja = [ ];
          this.totalGrilla = 0;
        }
      );

    },
    (error) =>{
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Primero debe abrirse la bóveda',
        confirmButtonColor: '#8963ff',
        confirmButtonText: 'Entendido',
      })
    }
    );
  }

  cerrarCaja(){
    this.cerrarCajaAsignada();
  }

  cerrarCajaAsignada(){
    let usuario = localStorage.getItem("user");
    let usuarioJson = JSON.parse(usuario);
    let idCaja = this.formCerrar.controls['cod_cajaCerrar'].value.id    
    let lstUpdateCantidades = [];
        
    for(let index in this.lstCantidadesCajaCerrar){
      let oCaja = {
        "denominacion_moneda": 11-Number(index),
        "cantidad": Number(this.lstCantidadesCajaCerrar[index])
      }
      lstUpdateCantidades.push(oCaja);
    }

    let oActualizar = 
      {
        codigo_estado_caja : "009002",
        user_mod : usuarioJson.id, 
        cajaasignada_set : {
            movimientoboveda_set: {
                boveda: 1,
                cod_tipo_movimiento_boveda : "029004",
                monto: this.formCerrar.controls["monto_transferirCerrar"].value,
                detallemovimientoboveda_set: lstUpdateCantidades,
            },
            operacion_set:{
                cod_forma_pago: "016001",
                cod_tipo_movimiento_caja:"030002",
                es_extorno: false
            }
        }
        
    }
    
    this.AdministrarCajaService.updateCaja(idCaja,oActualizar).subscribe((res) => {
      
      Swal.fire({
        icon: 'success',
        title: 'Registro actualizado correctamente',
        confirmButtonColor: '#8963ff',
        confirmButtonText: 'Entendido',
      })
      this.formCerrar.reset();
      this.getCajas();
      this.lstCantidadesCajaCerrar = [ ];
      this.totalGrillaCerrar = 0;
    })

    
  }

  

  /* crearMovimientoBoveda(idCajaAsignada: string, monto:number, codigoMovimientoBoveda:string){
    let idBoveda = "1";
    let idHistorialBoveda = "1"; //preguntar
    let usuario = localStorage.getItem("user");
    let usuarioJson = JSON.parse(usuario);
    let oMovimientoBoveda = {
      boveda: idBoveda,
      idHistorialBoveda: idHistorialBoveda,
      idCajaAsignada: idCajaAsignada,
      cod_tipo_movimiento_boveda: codigoMovimientoBoveda,
      monto: monto,
      anio: this.datepipe.transform(
        this.actualDate,
        "yyyy"
      ),
      mes: this.datepipe.transform(
        this.actualDate,
        "MM"
      ),
      dia: this.datepipe.transform(
        this.actualDate,
        "dd"
      ),
      user_reg: usuarioJson.id,
      fechaRegistra:this.datepipe.transform(
        this.actualDate,
        "yyyy-MM-dd hh:mm:ss"
      ),
      esEliminado: false,
    };
    let lstUpdateCantidades = [];
    if(this.active==1){
      lstUpdateCantidades=this.lstCantidadesCaja;
      for(let index in lstUpdateCantidades){
        lstUpdateCantidades[index]=-1*Number(this.lstCantidadesCaja[index]);
      }
    }
    else{
      lstUpdateCantidades = this.lstCantidadesCajaCerrar;
    }
    this.ActualizardetalleBoveda(oMovimientoBoveda.user_reg, lstUpdateCantidades , idBoveda);
    this.AdministrarCajaService.createMovimientoBoveda(oMovimientoBoveda).subscribe((results) => {
      
      let monedas;
      this.AdministrarCajaService.getMonedas().subscribe(
        (data: any) => {
          monedas=data.results;
          for(let moneda of monedas){
            if(!moneda.es_vigente){
              monedas.splice(
                monedas.indexOf(moneda, 0),1
              );
            }
          }
          for(let moneda of monedas){
            let idDenominacionMoneda = moneda.id;
            let cantidad = lstUpdateCantidades[11-moneda.id];
            this.crearDetalleMovimientoBoveda(results.id, idDenominacionMoneda, 
              cantidad);
          }
          
        },
        (err) => console.log(err)
      );


    });
  }; */

  

  /* ActualizardetalleBoveda(user,lista, bovedaId){

    let monedas
    this.AdministrarCajaService.getMonedas().subscribe((data: any) =>{
      monedas = data.results;
      for(let moneda of monedas){
        if(!moneda.es_vigente){
          monedas.splice(
            monedas.indexOf(moneda,0),1
          );
        }
      }
      this.AdministrarCajaService.getDetalleBovedaById(bovedaId).subscribe((resultados: any)=>{
        console.log("resultados y monedas");
        console.log(resultados.results);
        console.log(monedas);
        for(let moneda of monedas){
          let idDenominacionMoneda = moneda.id;
          let cantidad = Number(lista[11-moneda.id]) + Number(resultados.results[11-moneda.id].cantidad);
          let datos = {
            boveda: bovedaId,
            denominacion_moneda: idDenominacionMoneda ,
            cantidad: cantidad, 
            user_reg: user,
            user_mod: user
  
          }
          this.AdministrarCajaService.updateBoveda(moneda.id,datos).subscribe((results)=>{
            console.log("actualizando detalle boveda")
          })
  
        }
      })
      

    }, err => console.log(err) )

  } */

  /* crearOperacion(idCajaAsignada: string){
    let usuario = localStorage.getItem("user");
    let usuarioJson = JSON.parse(usuario);
    let oOperacion ={
      caja_asignada : idCajaAsignada,
      cod_forma_pago : string,
      cod_tipo_movimiento_caja : string,
      num_operacion : number,
      monto_operacion : number,
      monto_operacion_con_redondeo : number,
      es_extorno : false,
      user_reg : usuarioJson.id,
      fec_reg : this.datepipe.transform(
        this.actualDate,
        "yyyy-MM-dd hh:mm:ss"
      ),
      user_mod : usuarioJson.id,
      fec_mod : this.datepipe.transform(
        this.actualDate,
        "yyyy-MM-dd hh:mm:ss"
      ),
    }
  } */


  /* crearDetalleMovimientoBoveda(idMovimientoBoveda: string, idDenominacionMoneda: string, 
    cantidad:number){
    let usuario = localStorage.getItem("user");
    let usuarioJson = JSON.parse(usuario);
    let oDetalleMovimientoBoveda = {
      move_boveda: idMovimientoBoveda,
      denominacion_moneda: idDenominacionMoneda,
      cantidad: cantidad,
      user_reg: usuarioJson.id,
      fechaRegistra:this.datepipe.transform(
        this.actualDate,
        "yyyy-MM-dd hh:mm:ss"
      ),
      esEliminado: false,
    };
    this.AdministrarCajaService.createdetalleMovimientoBoveda(oDetalleMovimientoBoveda).subscribe((results) => {
      
    })
  }; */
/* 
  getCajasActivas() {
    for (let caja of this.lstCajas) {
      if (caja.codigo_estado_caja == "009001") {
        console.log(caja);
        this.lstCajasActivas.push(caja);
      }
    }
    console.log("Cajas activas");
    console.log(this.lstCajasActivas);
  } */

  

  clickA() {
    const dialogRef = this.dialog.open(CajaModalComponent, {
      width: "30%",
      height: "75%",
    });
    if(this.active==1){
      let lstMax = [];
      this.AdministrarCajaService.getDetalleBovedaById(1).subscribe(
        (data:any)=>{
          for (let item of data.results){
            lstMax.push(item.cantidad);
          }
          (<CajaModalComponent>dialogRef.componentInstance).max =
          this.formAperturar.controls["cod_caja"].value.monto_max;
          (<CajaModalComponent>dialogRef.componentInstance).min =
            this.formAperturar.controls["cod_caja"].value.monto_min;
          (<CajaModalComponent>dialogRef.componentInstance).lstMax = lstMax;
        }
      );
      
      
      
      dialogRef.componentInstance.emisor.subscribe((data) => {
        this.totalGrilla = data.total;
        this.lstCantidadesCaja = data.lstCantidades;
      });
      
    }else{
      (<CajaModalComponent>dialogRef.componentInstance).max = Number.POSITIVE_INFINITY;
      (<CajaModalComponent>dialogRef.componentInstance).min = 0;
      dialogRef.componentInstance.emisor.subscribe((data) => {
        this.totalGrillaCerrar = data.total;
        
        this.lstCantidadesCajaCerrar = data.lstCantidades;
      });
    }

    
  }

  onChangeCajero() {
  }

  cerrar(caja_id){
    for(let cajaAsignada of this.lstCajasAsignadas){
      if(cajaAsignada.caja.id == caja_id){
        this.formCerrar.controls['cod_cajaCerrar'].setValue(cajaAsignada.caja);
        this.onChangeCajaCerrar();
        break;
      }
    }
    this.active=2;
  }
  onChangeCajaCerrar(){
    let oCajaAsignada;
    for (let cajaAsignada of this.lstCajasAsignadas){
      if(cajaAsignada.caja.id == this.formCerrar.controls['cod_cajaCerrar'].value.id){
        oCajaAsignada = cajaAsignada;
        break;
      }
    }
    this.totalMontoCaja=oCajaAsignada.monto_actual;
    console.log(oCajaAsignada);
    this.formCerrar.controls['cod_cajeroCerrar'].setValue(oCajaAsignada.user_cajero.last_name+", "+oCajaAsignada.user_cajero.first_name);
    this.formCerrar.controls['num_cheques'].setValue(oCajaAsignada.num_pago_cheque);
    this.formCerrar.controls['monto_cheque'].setValue(oCajaAsignada.monto_cheque_cierre);
    this.formCerrar.controls['num_operaciones_electronicas'].setValue(oCajaAsignada.num_pago_tarjeta);
    this.formCerrar.controls['monto_operaciones_electronicas'].setValue(oCajaAsignada.monto_tarjeta_cierre);
    this.formCerrar.controls['monto_caja'].setValue(oCajaAsignada.monto_actual);

  }
}
