import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
import { style } from '@angular/animations';
import { Table } from '@fullcalendar/daygrid';
pdfMake.vfs = pdfFonts.pdfMake.vfs;   

@Component({
  selector: 'app-boveda-modal',
  templateUrl: './boveda-modal.component.html',
  styleUrls: ['./boveda-modal.component.sass']
})
export class BovedaModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BovedaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }

  ngOnInit(): void {
    
    this.generatePDFAbrirBoveda("abrir")
    
    
  }

  generatePDFAbrirBoveda(action) {  
    let docDefinition = {  
      pageSize: 'A5',

        
      content: [
        {
          text: 'APERTURA DE BÓVEDA',
          fontSize: 9,
          alignment: 'center',
          style: 'sectionHeader',
          color: "#000",
          
        },

        {
          columns: [   
            
            [
              {
                text: "OFICINA: ",
                style: 'sectionInfo2',
                bold: true
              },
              {
                text: "DNI: ",
                style: 'sectionInfo2',
                bold: true

              },
              {
                text: "JEFE DE OPERACIÓN: ",
                style: 'sectionInfo2',
                bold: true
              }
            ],
            [
              {
                text: "PRINCIPAL",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
              },
              {
                text: "_dni_",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],

              },
              {
                text: " _nombre_",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
              }

            ],

            [
              {
                text: "CÓDIGO MOVIMIENTO: ",
                style: 'sectionInfo2',
                bold: true
              },
              {
                text: "APERTURA: ",
                style: 'sectionInfo2',
                bold: true

              },
              {
                text: "TOTAL: ",
                style: 'sectionInfo2',
                bold: true
              }
            ],
            [
              {
                text: "_código_ ",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
                
              },
              {
                text: " 14/02/2020 07:55",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],

              },
              {
                text: " s/",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
              }
            ]
          ]
        },
        {
          text: 'DETALLE',
          fontSize: 8,
          bold: true,
          alignment: 'center',
          margin: [0, 20, 0, 15]

        },
        {
          columns:
          [
            { width: '*', text: '' },
            {
              width: "auto",
              table: {
                headerRows: 1,
                widths: [ 60, 100, 80, 60 ],
                body: [
                  [ { text: 'N°', bold: true, fontSize: 8, alignment: 'center',fillColor: '#eeeeee',}, {text:'DENOMINACIÓN', bold: true, fontSize: 8, alignment: 'center',fillColor: '#eeeeee',}, { text:'UNIDADES', bold: true, fontSize: 8, alignment: 'center',fillColor: '#eeeeee',}, {text:'SUBTOTAL',bold:true, fontSize: 8,alignment: 'center',fillColor: '#eeeeee',} ],
                  [ { text:'11', fontSize: 8, alignment: 'center'},  { text:'200.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'10', fontSize: 8, alignment: 'center'},  { text:'100.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'9', fontSize: 8, alignment: 'center'},  { text:'50.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'8', fontSize: 8, alignment: 'center'},  { text:'20.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'7', fontSize: 8, alignment: 'center'},  { text:'10.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'6', fontSize: 8, alignment: 'center'},  { text:'5.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'5', fontSize: 8, alignment: 'center'},  { text:'2.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'4', fontSize: 8, alignment: 'center'},  { text:'1.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'3', fontSize: 8, alignment: 'center'},  { text:'0.50', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'2', fontSize: 8, alignment: 'center'},  { text:'0.20', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'1', fontSize: 8, alignment: 'center'},  { text:'0.10', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [{text: ""},{text: ""},{text: ""},{text: ""}]
                ]
              },
              layout: 'lightHorizontalLines'
            },
            { width: '*', text: '' },
          ]
        },
        {
          columns: [
            [
              {
                text: "TOTAL",
                alignment: 'right',
                margin: [150, 10, 0, 10],
                fontSize: 8
              },
            ],
            [
              {
                text: "s/  5,000.00",
                alignment: 'right',
                margin: [0, 10, 85, 10],
                decoration: 'underline', 
                fontSize: 8
              }, 
            ] 
          ]
        },
        {
          text: '___________________________________',
          alignment: 'center',
          margin:[0,15,0,1] 
        },
        {
          text: '_name_',
          fontSize: 8,
          alignment: 'center',
          color: "#000",
          margin:[0,0,0,1]
        },
        {
          text: '_dni_',
          fontSize: 8,
          alignment: 'center',
          color: "#000",
          margin:[0,0,0,1]
        },
        {
          text: 'JEFE DE OPERACIONES',
          fontSize: 8,
          alignment: 'center',
          
          color: "#000",
          bold:true,
          margin:[0,0,0,1]
          
        },
      ],
      styles: {  
        sectionHeader: {  
          bold: true,  
          decoration: 'underline',  
          fontSize: 8,  
          margin: [0, -20, 0, 15]  
      },
      sectionInfo:{
        fontSize: 8,
        alignment: 'left'
      },
      sectionInfo2:{
        fontSize: 8,
        
        alignment: 'right'
      } 
      }
    };  
    pdfMake.createPdf(docDefinition).open();  
  }  
  generatePDFCerrarBoveda(action) {  
    let docDefinition = {  
      pageSize: 'A5',
      content: [
        {
          text: 'CIERRE DE BÓVEDA',
          fontSize: 9,
          alignment: 'center',
          style: 'sectionHeader',
          color: "#000",
        },
        {
          columns: [   
            [
              {
                text: "OFICINA: ",
                style: 'sectionInfo2',
                bold: true
              },
              {
                text: "DNI: ",
                style: 'sectionInfo2',
                bold: true
              },
              {
                text: "JEFE DE OPERACIÓN: ",
                style: 'sectionInfo2',
                bold: true
              }
            ],
            [
              {
                text: "PRINCIPAL",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
              },
              {
                text: "_dni_",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
              },
              {
                text: " _nombre_",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
              }
            ],
            [
              {
                text: "CÓDIGO MOVIMIENTO: ",
                style: 'sectionInfo2',
                bold: true
              },
              {
                text: "APERTURA: ",
                style: 'sectionInfo2',
                bold: true
              },
              {
                text: "CIERRE: ",
                style: 'sectionInfo2',
                bold: true
              }
            ],
            [
              {
                text: "_código_ ",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
              },
              {
                text: " 14/02/2020 07:55",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
              },
              {
                text: " 14/02/2020 19:55",
                style: 'sectionInfo',
                margin: [3, 0, 0, 0 ],
              }
            ]
          ]
        },
        {
          columns: [
            [
              {
                text: "MONTO EN CHEQUE",
                fontSize: 8,
                margin:[117,15,0,0],
                alignment: 'left',
              },
              {
                text: "MONTO EN OP TARJETA",
                fontSize: 8,
                margin:[117,0,0,0],
                alignment: 'left',
              },
              {
                text: "MONTO EN EFECTIVO",
                fontSize: 8,
                margin:[117,0,0,0],
                alignment: 'left',
              },
            ],
            [
              {
                text: "S/",
                fontSize: 8,
                margin:[178,15,20,0],
                alignment: 'left',
              },
              {
                text: "S/",
                fontSize: 8,
                margin:[178,0,20,0],
                alignment: 'left',
              },
              {
                text: "S/",
                fontSize: 8,
                margin:[178,0,20,0],
                alignment: 'left',
              },
              {
                text: "TOTAL:  S/",
                fontSize: 8,
                margin:[147.3,0,20,0],
                alignment: 'left',
                bold:true
              }
            ],
            [
              {
                text: "0.00",
                fontSize: 8,
                margin:[0,15,163,0],
                alignment: 'right',
              },
              {
                text: "0.00",
                fontSize: 8,
                margin:[0,0,163,0],
                alignment: 'right',
              },
              {
                text: "0.00",
                fontSize: 8,
                margin:[0,0,163,0],
                alignment: 'right',
              },
              {
                text: "0.00",
                fontSize: 8,
                margin:[0,0,163,0],
                alignment: 'right',
                bold: true
              }
            ],
          ]
        },
        {
          text: 'DETALLE',
          fontSize: 8,
          bold: true,
          alignment: 'center',
          margin: [0, 20, 0, 15]
        },
        {
          columns:
          [
            { width: '*', text: '' },
            {
              width: "auto",
              table: {
                headerRows: 1,
                widths: [ 60, 100, 80, 60 ],
                body: [
                  [ { text: 'N°', bold: true, fontSize: 8, alignment: 'center',fillColor: '#eeeeee',}, {text:'DENOMINACIÓN', bold: true, fontSize: 8, alignment: 'center',fillColor: '#eeeeee',}, { text:'UNIDADES', bold: true, fontSize: 8, alignment: 'center',fillColor: '#eeeeee',}, {text:'SUBTOTAL',bold:true, fontSize: 8,alignment: 'center',fillColor: '#eeeeee',} ],
                  [ { text:'11', fontSize: 8, alignment: 'center'},  { text:'200.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'10', fontSize: 8, alignment: 'center'},  { text:'100.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'9', fontSize: 8, alignment: 'center'},  { text:'50.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'8', fontSize: 8, alignment: 'center'},  { text:'20.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'7', fontSize: 8, alignment: 'center'},  { text:'10.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'6', fontSize: 8, alignment: 'center'},  { text:'5.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'5', fontSize: 8, alignment: 'center'},  { text:'2.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'4', fontSize: 8, alignment: 'center'},  { text:'1.00', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'3', fontSize: 8, alignment: 'center'},  { text:'0.50', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'2', fontSize: 8, alignment: 'center'},  { text:'0.20', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [ { text:'1', fontSize: 8, alignment: 'center'},  { text:'0.10', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'}, { text:'0', fontSize: 8, alignment: 'center'} ],
                  [{text: ""},{text: ""},{text: ""},{text: ""}]
                ]
              },
              layout: 'lightHorizontalLines'
            },
            { width: '*', text: '' },
          ]
        },
        {
          columns: [ 
            [
              {
                text: "TOTAL",
                alignment: 'right',
                margin: [150, 10, 0, 10],
                fontSize: 8
              },
            ],
            [
              {
                text: "s/  5,000.00",
                alignment: 'right',
                margin: [0, 10, 85, 10],
                decoration: 'underline', 
                fontSize: 8
              }, 
            ] 
          ]
        },
        {
          text: '___________________________________',
          alignment: 'center',
          color: "#000",
          margin:[0,15,0,2]  
        },
        {
          text: '_name_',
          fontSize: 8,
          alignment: 'center',
          color: "#000",
          margin:[0,2,0,2]
        },
        {
          text: '_dni_',
          fontSize: 8,
          alignment: 'center',
          margin:[0,2,0,2]
        },
        {
          text: 'JEFE DE OPERACIONES',
          fontSize: 8,
          alignment: 'center',
          bold:true,
          margin:[0,2,0,2]
        },
      ],
      styles: {  
        sectionHeader: {  
            bold: true,  
            decoration: 'underline',  
            fontSize: 8,  
            margin: [0, -20, 0, 15]  
        },
        sectionInfo:{
          fontSize: 8,     
          alignment: 'left'
        },
        sectionInfo2:{
          fontSize: 8,
          alignment: 'right'
        }   
      }
    };  
   
    pdfMake.createPdf(docDefinition).open();  
  } 

  

}
