import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdministrarCajaService } from "../../../../core/service/caja/administrar-caja.service";
import { NgbNavChangeEvent } from "@ng-bootstrap/ng-bootstrap";
import { MatDialog } from "@angular/material/dialog";
import { CajaModalComponent } from "../caja-modal/caja-modal.component";
import { DatePipe } from "@angular/common";
import Swal from 'sweetalert2';

@Component({
  selector: "app-cierre-caja",
  templateUrl: "./cierre-caja.component.html",
  styleUrls: ["./cierre-caja.component.sass"],
})
export class CerrarCajaComponent implements OnInit {
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
    this.getCajerosDisponibles();
    this.getCajasDisponibles();
    this.getCajasAsignadas();
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
  getCajerosDisponibles() {
    this.lstCajeros = [ ];
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
            if(caja.user_cajero.id == cajero.id && caja.fec_cierre==null){
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
  getCajasDisponibles() {
    this.lstCajas = [ ];
    this.AdministrarCajaService.getCajas().subscribe(
      (data: any) => {
        this.lstCajas = data.results;
        this.lstCajasDisponibles = this.lstCajas;
        for (let caja of this.lstCajasDisponibles) {
          if (caja.codigo_estado_caja == "009001") {
            this.lstCajasDisponibles.splice(
              this.lstCajasDisponibles.indexOf(caja, 0),1
            );
          }
        }
        
      },
      (err) => console.log(err)
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
      this.getCajasDisponibles();
      this.getCajerosDisponibles();
      this.lstCantidadesCajaCerrar = [ ];
      this.totalGrillaCerrar = 0;
      Swal.fire({
        icon: 'success',
        title: 'Registro actualizado correctamente',
        confirmButtonColor: '#8963ff',
        confirmButtonText: 'Entendido',
      })
      this.formCerrar.reset();
      this.getCajasAsignadas();
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

  getCajasAsignadas(){
    this.lstGrilla = [];
    this.AdministrarCajaService.getCajasAsignadas().subscribe(
      (data: any) => {
        this.lstCajasAsignadas = data.results;
        for (let cajaAsignada of this.lstCajasAsignadas) {
          if (cajaAsignada.fec_cierre == null) {
            let grillaItem = {
              apertura: cajaAsignada.fec_asignacion,
              caja: cajaAsignada.caja.nombre,
              cajero: cajaAsignada.user_cajero.last_name +", "+ cajaAsignada.user_cajero.first_name,
              monto: cajaAsignada.monto_actual,
            };
            this.lstGrilla.push(grillaItem);
          }
          else{
            let grillaItem = {
              apertura: cajaAsignada.fec_asignacion,
              caja: cajaAsignada.caja.nombre,
              cajero: cajaAsignada.user_cajero.last_name +", "+ cajaAsignada.user_cajero.first_name,
              monto: cajaAsignada.monto_actual,
            };
            this.lstGrilla.push(grillaItem);
          }
        }
      },
      (err) => console.log(err)
    );
  }

  clickA() {
    const dialogRef = this.dialog.open(CajaModalComponent, {
      width: "30%",
      height: "75%",
    });
    
      (<CajaModalComponent>dialogRef.componentInstance).max = Number.POSITIVE_INFINITY;
      (<CajaModalComponent>dialogRef.componentInstance).min = 0;
      dialogRef.componentInstance.emisor.subscribe((data) => {
        this.totalGrillaCerrar = data.total;
        
        this.lstCantidadesCajaCerrar = data.lstCantidades;
      });
    

    
  }

  onChangeCajero() {
  }
  onChangeCajaCerrar(){
    let oCajaAsignada;
    for (let cajaAsignada of this.lstCajasAsignadas){
      if(cajaAsignada.caja.nombre == this.formCerrar.controls['cod_cajaCerrar'].value.nombre){
        oCajaAsignada = cajaAsignada;
        break;
      }
    }
    this.cajeroCerrar=oCajaAsignada.user_cajero;
    this.formCerrar.controls['num_cheques'].setValue(oCajaAsignada.num_pago_cheque);
    this.formCerrar.controls['monto_cheque'].setValue(oCajaAsignada.monto_cheque_cierre);
    this.formCerrar.controls['num_operaciones_electronicas'].setValue(oCajaAsignada.num_pago_tarjeta);
    this.formCerrar.controls['monto_operaciones_electronicas'].setValue(oCajaAsignada.monto_tarjeta_cierre);
    this.formCerrar.controls['monto_caja'].setValue(oCajaAsignada.monto_actual);

  }
}
