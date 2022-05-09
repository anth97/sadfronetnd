import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { PredioAreaComun, PredioAreaComunCompartido } from '../../interfaces/predio/predioAreaComun.interface';
import { map } from 'rxjs/operators';


const base_url = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PredioAreaComunService {

  constructor(private http: HttpClient) { }


  list(id_predio_bien_comun: string){
    const url = `${base_url}/predio_compartido?predio_bien_comun=${id_predio_bien_comun}`;
    return this.http.get<any>(url)
      .pipe(
        map((resp: { results: Array<PredioAreaComun> }) => resp.results)
      );
  }

  create(object: PredioAreaComunCompartido){
    const url = `${base_url}/predio_compartido/`;
    return this.http.post<any>(url, object)
  }

  edit (id: string, data: Object){
    const url = `${base_url}/predio_compartido/${id}/`;
    return this.http.patch<any>(url, data)
  }

  buscarPrediosByCodigo(codigo: string){
    return this.http.get<any>(`${base_url}/predio_all/?cod_predio=${codigo}`);
  }

  delete(id: string){
    const url = `${base_url}/predio_compartido/${id}/`;
    return this.http.delete<any>(url)
  }

  listById(id: string){
    const url =`${base_url}/predio_compartido/${id}/`;
    return this.http.get<any>(url)
      /* .pipe(
        map((resp: { predio: Object }) => resp.predio)
      ) */
  }

  getValuesofBienComun(data: any){ //data is {predio: predio_id}
    const url = `${base_url}/arancel_predio_urbano/info_valor/`;
    return this.http.post<any>(url, data);
  }

  filterPredioAreaComun(predio){
    const url = `${base_url}/predio_a_comun/?predio=${predio}`;
    return this.http.get<any>(url);
  }

  editPredioAreaComun (id: string, data: Object){
    const url = `${base_url}/predio_a_comun/${id}/`;
    return this.http.patch<any>(url, data)
  }

  getByAddress(address: string){
    const url = `${base_url}/predio_a_comun/predio_direccion/?direccion=${address}`;
    return this.http.get<any>(url)     
  }

  createPredioBienComun(data: any){
    const url = `${base_url}/predio_a_comun/`;
    return this.http.post<any>(url, data);
  }
}
