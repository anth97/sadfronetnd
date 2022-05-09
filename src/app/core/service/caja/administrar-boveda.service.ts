import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdministrarBovedaService {
  

  constructor(private http: HttpClient) { }

  getCajas(){
    return this.http.get(`${environment.apiUrl}/cajas`);
  }
  
  getBoveda(id){
    return this.http.get(`${environment.apiUrl}/boveda/${id}/`,)

  }

  getMonedas(){
    return this.http.get(`${environment.apiUrl}/denominacion_moneda?page_size=25`)
  }


  //función para abrir o cerar boveda
  accionBoveda(id,data){
    return this.http.post(`${environment.apiUrl}/abrir_boveda/abrir_boveda/`,data)
  }

  cerrarBoveda(id,data){
    return this.http.post(`${environment.apiUrl}/cerrar_boveda/cerrar_boveda/`,data)
  }
  

  getFiscalizador(id){
    return this.http.get(`${environment.apiUrl}/users/${id}/`);
  }

  //crear historial boveda
  historialBoveda(data){
    return this.http.post(`${environment.apiUrl}/historialBoveda/`,data);
  }

  //completar el historial al cerrar boveda
  completarHistorialBoveda(id,data){
    return this.http.patch(`${environment.apiUrl}/historialBoveda/${id}/`,data);
  }

  movimientoBoveda(data){
    return this.http.post(`${environment.apiUrl}/movimientoBoveda/`,data);
  }

  detalleMovimientoBoveda(data){
    return this.http.post(`${environment.apiUrl}/detalleMovimientoBoveda/`,data);
  }

  //actualizar el detalle boveda
  detalleBoveda(id,data){
    return this.http.patch(`${environment.apiUrl}/detalleBoveda/${id}/`,data);
  }

  ObtenerDetalleBoveda(){
    return this.http.get(`${environment.apiUrl}/detalleBoveda?page_size=25`);
  }
  
  detalleBovedaHistorial(data){
    return this.http.post(`${environment.apiUrl}/detalleBovedaHistorial/`,data);
  }

  completarDetalleBovedaHistorial(data,id){
    return this.http.patch(`${environment.apiUrl}/detalleBovedaHistorial/${id}/`,data);
  }

  getCajasAsignadasCerradas(fecha){
    return this.http.get(`${environment.apiUrl}/cajaAsignada/?fec_cierre/${fecha}`);
  }

  getCajasAsignadas(){
    return this.http.get(`${environment.apiUrl}/cajaAsignada/`)
  }

  getHistorialBoveda(id){
    return this.http.get(`${environment.apiUrl}/historialBoveda/last`);
  }
  


}
