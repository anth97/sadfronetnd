import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-caja-modal',
  templateUrl: './caja-modal.component.html',
  styleUrls: ['./caja-modal.component.sass']
})
export class CajaModalComponent implements OnInit {

  lstDenominaciones = [ "200.00", "100.00", "50.00", "20.00", "10.00", "5.00", "2.00", "1.00", "0.50", "0.20", "0.10" ];
  lstCantidades = [ "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
  lstSubTotales = [ "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
  lstMax = [ Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY];
  valido = true;
  
  total=0;
  @Input() min;
  @Input() max;
  @Output() emisor: EventEmitter<any> = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<CajaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit(): void {
    this.calcularTotal(0);
  }

  calcularSubTotal(denominacion: number, cantidad: number, id:number){
    let subTotal=denominacion*cantidad;
    if(isNaN(subTotal)){
      subTotal = 0;
    } 
    this.lstSubTotales[id]=String(subTotal);
    return subTotal;
  }
  calcularTotal(i){
    this.total=0;
    for(let subTotal of this.lstSubTotales){
      this.total+=Number(subTotal);
    }
    if(Number(this.lstCantidades[i])>this.lstMax[i]){
      this.valido=false;
    }
    else{
      this.valido=true;
    }
  }
  enviar(){
    if(this.total>= this.min && this.total<= this.max){
      let objeto={
        total: this.total,
        lstCantidades: this.lstCantidades,
      }
      this.emisor.emit(objeto);
      this.dialogRef.close();
    }
    else if(this.total>= this.min && this.total> this.max){
      alert(`El monto debe ser menor al máximo establecido (${this.max})`);
    }
    else{
      alert(`El monto debe ser mayor al mínimo establecido (${this.min})`);
    }
    
  }
  returnTotal(){
    return this.total;
  }
}
