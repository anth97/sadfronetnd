import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { BovedaModalComponent } from './boveda-modal/boveda-modal.component'
import { AdministrarBovedaService } from './../../../core/service/caja/administrar-boveda.service'
import { DatePipe } from '@angular/common';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-administrar-boveda',
  templateUrl: './administrar-boveda.component.html',
  styleUrls: ['./administrar-boveda.component.sass']
})
export class AdministrarBovedaComponent implements OnInit{
  public form:FormGroup;
  public form2:FormGroup;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private BovedaServide: AdministrarBovedaService,
    public datepipe: DatePipe
  ) {

    
    
  }
  active=true;
  lstDenominaciones = [ "200.00", "100.00", "50.00", "20.00", "10.00", "5.00", "2.00", "1.00", "0.50", "0.20", "0.10" ];
  
  lstCantidades = [];
  lstCantidades2 = [];
  lstSubTotales = [ "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
  total=0;
  actualDate = new Date();
  user = localStorage.getItem("user");
  jsonUsuario = JSON.parse(this.user);
  estado: boolean;
  nroCheques = 0;
  montoCheque = 0;
  nroTarjeta = 0;
  montoTarjeta = 0;

  fechaC="fecha"

  lstCajasAsignadas = [];
  lstCajasAsignadasCerradas = [];
  lstGrilla = [];
  cajaAbierta : boolean;



  
  ngOnInit(): void {

    this.EstadoBoveda();

    this.ObtenerDetalle(this.lstCantidades);
    
    this.getCajaCerradas();
    
    

   
    this.form = this.fb.group({
      usuario: [this.jsonUsuario.id, [Validators.required]],
      fecha_actual: [this.fecha, [Validators.required]],
      hora_actual: [this.hora, [Validators.required]],
      monto_sistema: ["",[Validators.required]],
    })

    this.form2 = this.fb.group({
      nro_cheques: [this.nroCheques, [Validators.required]],
      monto_cheque: [this.montoCheque, [Validators.required]],
      op_electr: [this.nroTarjeta, [Validators.required]],
      monto_op_electr: [this.montoTarjeta, [Validators.required]],
      usuario_apertura: [this.jsonUsuario.id, [Validators.required]],
      fecha_apertura: ["", [Validators.required]],
      monto_sistema: ["", [Validators.required]],

    })


    this.getCajasAsignadas()

    
    console.log(this.fechaC)
    
    
  }
  onRegister() {
    console.log("Form Value", this.form.value);
  }
  InputNumber(evt){
    let key = false;
    var ch = String.fromCharCode(evt.which);
    if(!(/^\d*\.?\d*$/.test(ch))){
      evt.preventDefault();
    }
    
  }

  clickA(){
    const dialogRef = this.dialog.open(BovedaModalComponent, {
      width: '700px',
      height: '70%',
      data: "",
            
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('asdasd');
    })
  }
  calcularSubTotal(denominacion: number, cantidad: number, id:number){
    let subTotal=denominacion*cantidad;
    if(isNaN(subTotal)){
      subTotal = 0;
    } 
    this.lstSubTotales[id]=String(subTotal);
    
    return subTotal;
  }
  /* get calcularTotal(){
    this.total=0;
    for(let subTotal of this.lstSubTotales){
      this.total+=Number(subTotal);
    }
    return this.total
  } */
  EstadoBoveda(){
    
    this.BovedaServide.getBoveda(1).subscribe((data: any)=>{
      
      if(data.codigo_estado_boveda=="008001"){
        this.estado = true

      }else if(data.codigo_estado_boveda=="008002"){
        this.estado = false
      }

      if(data.fec_mod != null){
        this.fechaC = data.fec_mod
        this.fechaC = this.datepipe.transform(this.fechaC, "dd/MM/yyyy HH:mm")
        this.form2.controls["fecha_apertura"].setValue(this.fechaC)
        
        

      }
      console.log(this.fechaC)
      
      
    })
  }

  


  abrirBoveda(){
    let usuario = localStorage.getItem("user");
    let jsonUsuario = JSON.parse(usuario);

    let boveda = {
      boveda: 1,
      codigo_boveda: "008000",
      codigo_estado_boveda: "008001",
      "user_mod": jsonUsuario.id
    }

     

   /*  let Historial = {
      boveda: 1,
      user_apertura: jsonUsuario.id,
      user_cierre: null,
      fec_apertura: this.actualDate,
      fec_cierre: null,
      fec_apertura_real: this.actualDate,
      fec_cierre_real: null,
      monto_apertura: 0,
      monto_cierre: null,
      monto_tarjeta_cierre: null,
      monto_cheque_cierre: null,
      monto_total_cierre: null,
      num_pago_efectivo: null,
      num_pago_tarjeta: null,
      num_pago_cheque: null,
      num_extornos: null,

    } */
    //se abre la boveda 
    this.BovedaServide.accionBoveda(1,boveda).subscribe(res =>{
      console.log("Boveda abierta")

      

      //this.ActualizardetalleBoveda(jsonUsuario.id,this.lstCantidades)

      //se crea el historial
      /* this.BovedaServide.historialBoveda(Historial).subscribe((data : any ) =>{
        console.log("HistorialCreado")
        this.idHistorial = data.id;
        
        //se crean los detalles de historial boveda
        this.crearDetalleHistorialBoveda(data.id);

        let movimientoBoveda = {
          boveda: 1,
          historial_boveda: data.id,
          caja_asignada: null,
          cod_tipo_movimiento_boveda: "029001",
          monto: 0,
          anio: this.Anio,
          mes: this.Mes,
          dia: this.Dia,
          user_reg :  jsonUsuario.id ,
          
        }
        
        //movimiento
        this.BovedaServide.movimientoBoveda(movimientoBoveda).subscribe((data1: any)=> {
          console.log("Movimiento boveda creado")
        })

        


      }, err => console.log(err)) ; */


    }, err => console.log(err));


  }

  //método para obtener el detalle boveda
  ObtenerDetalle(listaDetalle){
    this.BovedaServide.ObtenerDetalleBoveda().subscribe((data: any) =>{
      let lista = data.results;
      console.log(lista)
      for(let list of lista){
        
        let olista = {
          "cantidad" : list.cantidad,
          "denominacion": Number(this.lstDenominaciones[11-list.id]),
          "subtotal": list.cantidad*Number(this.lstDenominaciones[11-list.id])

        }
        
        listaDetalle.push(olista);
        
      }
      
      listaDetalle.sort((a, b) => (a.denominacion > b.denominacion ? -1 : 1));
      
      this.total=0;
      
      for(let i of listaDetalle){
        this.total+=i.subtotal
        
      }
      console.log(this.total)





      
    });
    
  }


  //método para actualizar los registros de detalle_boveda
  ActualizardetalleBoveda(user,lista){

    
    let monedas
    this.BovedaServide.getMonedas().subscribe((data: any) =>{
      monedas = data.results;
      for(let moneda of monedas){
        if(!moneda.es_vigente){
          monedas.splice(
            monedas.indexOf(moneda,0),1
          );
        }
      }
      for(let moneda of monedas){
        let idDenominacionMoneda = moneda.id;
        let cantidad = lista[moneda.id-1];
        let datos = {
          boveda: 1,
          denominacion_moneda: idDenominacionMoneda,
          cantidad: cantidad,
          user_reg: user,
          user_mod: user
          
        }
        this.BovedaServide.detalleBoveda(moneda.id,datos).subscribe((results)=>{
          
        } , err => console.log(err) )
                
      }

    }, err => console.log(err) )

  }

  //Método para crear registros de historial_detablle_boveda
  /* crearDetalleHistorialBoveda(idHistorial){
    let monedas
    this.BovedaServide.getMonedas().subscribe((data: any) =>{
      monedas = data.results;
      for(let moneda of monedas){
        if(!moneda.es_vigente){
          monedas.splice(
            monedas.indexOf(moneda,0),1
          );
        }
      }
      for(let moneda of monedas){
        let idDenominacionMoneda = moneda.id;
        let cantidad = this.lstCantidades[moneda.id-1];
        let data = {
          historial_boveda: idHistorial,
          denominacion_moneda: idDenominacionMoneda ,
          cantidad_apertura: cantidad,
          cantidad_cierre: null,
          
  
        }
        this.BovedaServide.detalleBovedaHistorial(data).subscribe((data: any)=>{
          
          this.lstId_DetalleHistorial.push(data.id);
          
          

        } , err => console.log(err) )
                
      }
      
      
    }, err => console.log(err) )

  } */

  //método para completar el detalleCerrarBoverda
  /* completarDetalleHistorialBoveda(idHistorial){
    
    let monedas
    this.BovedaServide.getMonedas().subscribe((data: any) =>{
      monedas = data.results;

      //para eliminar las monedas que no son vigentes
      for(let moneda of monedas){
        if(!moneda.es_vigente){
          monedas.splice(
            monedas.indexOf(moneda,0),1
          );
        }
      } 
      let x = 0;
      for(let moneda of monedas){
        
        
        let cantidad = this.lstCantidades2[moneda.id-1];
        let data = {
          cantidad_cierre: cantidad,
  
        }
        this.BovedaServide.completarDetalleBovedaHistorial(data,this.lstId_DetalleHistorial[x]).subscribe((results)=>{
          
          
        }, err => console.log(err))

        x=x+1; 
              
      }
      
    }, err => console.log(err) )

  } */

  /* completarHistorialBoveda(user,idHistorial){
    let Historial = {
      user_cierre: user,
      fec_cierre: this.actualDate,
      fec_cierre_real: this.actualDate,
      monto_cierre: null,
      monto_tarjeta_cierre: null,
      monto_cheque_cierre: null,
      monto_total_cierre: null,
      num_pago_efectivo: null,
      num_pago_tarjeta: null,
      num_pago_cheque: null,
      num_extornos: null,

    }
    this.BovedaServide.completarHistorialBoveda(idHistorial,Historial).subscribe((data : any ) =>{
      console.log("HistorialCompletado")

      this.movimientoBoveda(idHistorial,user)
      this.completarDetalleHistorialBoveda(idHistorial);
     });    
    } */

  cerrarBoveda(){
    this.ObtenerDetalle(this.lstCantidades2)
    let usuario = localStorage.getItem("user");
    let jsonUsuario = JSON.parse(usuario);
    let boveda= {
      boveda: 1,
      codigo_estado_boveda: "008002",
      
      user_mod: jsonUsuario.id,
    }
    //cierra boveda
    this.BovedaServide.cerrarBoveda(1,boveda).subscribe(res =>{
      //actualizar el detalle boveda al cerrar
      /* this.ActualizardetalleBoveda(jsonUsuario.id,this.lstCantidades2); */
    });

    /* this.completarHistorialBoveda(jsonUsuario.id,this.idHistorial); */
  }
 
  //método para crear un registro en movimiento boveda al cerrar la boveda
  /* movimientoBoveda(id,user){
    let movimiento = {
      boveda: 1,
      historial_boveda: id,
      caja_asignada: null,
      cod_tipo_movimiento_boveda: "029002",
      monto: 0,
      anio: this.Anio,
      mes: this.Mes,
      dia: this.Dia,
      user_reg :  user ,
    }

    this.BovedaServide.movimientoBoveda(movimiento).subscribe((data1: any)=> {
      console.log("Movimiento boveda creado")
    })

  } */



  get fecha(){
    let date = this.datepipe.transform(this.actualDate, "yyyy/dd/MM")
    return date

  }
  get hora(){
    let hora = this.datepipe.transform(this.actualDate, "HH:mm") 
    
    return hora
  }
  //fecha completa 
  get fecha2(){
    let date = this.datepipe.transform(this.actualDate, "dd-MM-yyyy")
    return date
  }

  get Anio(){
    let date = this.datepipe.transform(this.actualDate, "yyyy")
    return date

  }
  get Mes(){
    let date = this.datepipe.transform(this.actualDate, "MM")
    return date
  }
  get Dia(){
    let date = this.datepipe.transform(this.actualDate, "dd")
    return date
  }
  get Fec(){
    let today = new Date().toLocaleDateString()
    today = this.datepipe.transform(this.actualDate, "yyyy-MM-dd")
    let str = String(today)
    
    return str+"T00:00:00"
  }

  getCajasAsignadas(){
    this.BovedaServide.getCajasAsignadas().subscribe(
      (data: any) => {
        this.lstCajasAsignadas = data.results;
        
        
        let cont = 0;
        for (let cajaAsignada of this.lstCajasAsignadas) {
          if (cajaAsignada.fec_cierre == null) {
            let grillaItem = {
              apertura: cajaAsignada.fec_asignacion,
              caja: cajaAsignada.caja.nombre,
              cajero: cajaAsignada.user_cajero.last_name +", "+ cajaAsignada.user_cajero.first_name,
              monto: cajaAsignada.monto_actual,
              abierto: true,
              
            };
            this.lstGrilla.push(grillaItem);
            cont+=1
          }
        }
        if(cont > 0){
          this.cajaAbierta = true;
        }else{
          this.cajaAbierta = false;
        }
      },
      (err) => console.log(err)
    );
  }

  getCajaCerradas(){
    
    this.BovedaServide.getCajasAsignadasCerradas(this.Fec).subscribe((data: any)=>{
      this.lstCajasAsignadasCerradas = data.results;
      for (let caja of this.lstCajasAsignadasCerradas){
        if(caja.num_pago_cheque != null){
          this.nroCheques+=caja.num_pago_cheque
        }
        if(caja.monto_cheque_cierre != null){
          this.montoCheque+=caja.monto_cheque_cierre
        }

        if(caja.num_pago_cheque != null){
          this.nroTarjeta+=caja.num_pago_tarjeta
        }
        if(caja.monto_cheque_cierre != null ){
          this.montoTarjeta+=caja.monto_tarjeta_cierre
        }
        
        
      }

    },(err)=> console.log(err));
  }
  

 

}
