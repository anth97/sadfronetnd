import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CajaAsignada } from '../../interfaces/caja/cajaAsignada.interface'
import { MovimientoBoveda } from '../../interfaces/caja/movimientoBoveda.interface'
import { DetalleMovimientoBoveda } from '../../interfaces/caja/detalleMovimientoBoveda.interface'
import { Operacion } from '../../interfaces/caja/operacion.interface'

import { map } from 'rxjs/operators';

const base_url = environment.apiUrl; 

@Injectable({
  providedIn: 'root'
})

export class AdministrarCajaService {
    constructor(private http: HttpClient) { }
    
    getUsers(){
        return this.http.get(`${environment.apiUrl}/users?page_size=100`);
    }
    getCajas(){
        return this.http.get(`${environment.apiUrl}/cajas`);
    }
    getCajasAsignadas(){
        return this.http.get(`${environment.apiUrl}/cajaAsignada`);
    }
    getCajasAsignadasAbiertas(){
        return this.http.get(`${environment.apiUrl}/cajaAsignadaAbierta`);
    }
    updateCaja(id, data){
        return this.http.patch(`${environment.apiUrl}/cajas/${id}/`,data);
    }
    createCajaAsignada(object: CajaAsignada){
        const url = `${base_url}/cajaAsignada/`;
        return this.http.post<any>(url, object)
    }
    createMovimientoBoveda(object: MovimientoBoveda){
        const url = `${base_url}/movimientoBoveda/`;
        return this.http.post<any>(url, object)
    }
    createdetalleMovimientoBoveda(object: DetalleMovimientoBoveda){
        const url = `${base_url}/detalleMovimientoBoveda/`
        return this.http.post<any>(url, object)
    }
    createOperacion(object: Operacion){
        const url = `${base_url}/operacion/`
        return this.http.post<any>(url, object)
    }

    getDetalleBovedaById(id){
        return this.http.get(`${environment.apiUrl}/detalleBoveda/?boveda=${id}&page_size=100`)
    }

    updateBoveda(id, data){
        return this.http.patch(`${environment.apiUrl}/detalleBoveda/${id}/`,data);
    }


    getMonedas(){
        return this.http.get(`${environment.apiUrl}/denominacion_moneda?page_size=100`)
    }

    getCajaById(id:string){
        return this.http.get(`${environment.apiUrl}/cajas/${id}`);
    }
    getUserById(id:string){
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }
    getDetalleMovimientoBovedaById(id:string){
        return this.http.get(`${environment.apiUrl}/detalleMovimientoBoveda/?move_boveda_id=${id}`);
    }
    getCajaAsignadaById(id:string){
        return this.http.get(`${environment.apiUrl}/cajaAsignada/${id}`);
    }
}