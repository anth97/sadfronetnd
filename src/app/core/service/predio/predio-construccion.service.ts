import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { PredioConst } from '../../interfaces/predio/predioConst.interface';

import { map } from 'rxjs/operators';

const base_url = environment.apiUrl; 

@Injectable({
  providedIn: 'root'
})
export class PredioConstruccionService {

  constructor(private http: HttpClient) { }


  list(id: string){
    const url = `${base_url}/predio_const?predio=${id}`;
    return this.http.get<any>(url)
      .pipe(
        map((resp: { results: Array<PredioConst> }) => resp.results)
      ); 
  }

  listById(id: string){
    const url =`${base_url}/predio_const/${id}/`;
    return this.http.get<any>(url)
      /* .pipe(
        map((resp: { predio: Object }) => resp.predio)
      ) */
  }

  create(object: PredioConst){
    const url = `${base_url}/predio_const/`;
    return this.http.post<any>(url, object)
  }


  /*
  region: codigo de la region,
  codigos: todos los codigos separados por comas
  area: area de la construccion
  */
  getPredioConstruccionCategoria(region, codigos, area){
    const url = `${base_url}/valor_unitario_construcc/validar/?region=${region}&codigos=${codigos}&area=${area}
    `;
    return this.http.get<any>(url)
  }

  getValorIncremento(piso){
    const url = `${base_url}/valor_incremento/validar/?piso=${piso}`;
    return this.http.get<any>(url)
  }

  /**
   * 
   * @param codUso : String es el cod de uso
   * @param codEstruct : String es el cod de la estructura predominante
   * @param codEstado : String codigo de la estado 
   * @param anios : String antiguedad.
   * @returns observable http
   */
  getValorDepreciacion(codUso, codEstruct, codEstado, anios){
    const url = `${base_url}/valor_deprecion/validar/?cod_uso=035001&cod_estruct=015002&cod_estado=011003&anios=2`;
    return this.http.get<any>(url)
  }

  edit (id: string, data: Object){
    const url = `${base_url}/predio_const/${id}/`;
    return this.http.patch<any>(url, data)
  }

  delete(id: string){
    const url = `${base_url}/predio_const/${id}/`;
    return this.http.delete<any>(url)
  }

  listTabla(cod: string){
    const url = `${base_url}/tablas_maestras/personalizado/?tabla=${cod}`;
    return this.http.get<any>(url)
  }

  listPredioById(id: string){
    const url = `${base_url}/predios_urbanos/${id}/`;
    return this.http.get<any>(url)
  }

  listPrediosByAddress(address: string){
    const url = `${base_url}/predios_urbanos?prediourbano__direccion=${address}`;
    return this.http.get<any>(url)
    /* .pipe(
      map((resp: { predios: Array<PredioConst> }) => resp.predios)
    );  */
  }

  updatePredio(id: string, data: any){
    const url = `${base_url}/predios/${id}/`;
    return this.http.patch<any>(url, data)
  }

}

