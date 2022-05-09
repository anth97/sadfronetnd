import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PredioComplementos } from '../../interfaces/predio/predioComplements.interface'
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PredioComplementsService {

  constructor(private http: HttpClient) { }

  createPredioComplementos(data){
    return this.http.post(`${environment.apiUrl}/predio_complements/`, data)

  }
  updatePredioComplementos(id,data){
    return this.http.patch(`${environment.apiUrl}/predio_complements/${id}/`,data)
  };

  getEstructPredominant(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/estruct_predominant/`);
  }

  getEstadoConserva(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/estado_conserva/`);
  }

  getEstadoConstruc(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/estado_construcc/`);
  }
  getClasificacion(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/clasif_obra_complemen/`);
  }

  getUnidadMedidad(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/unidad_medida/`);

  }

  getPredioById(id){
    return this.http.get(`${environment.apiUrl}/predio_complements/${id}/`)
  }

  getComplemento(id){
    return this.http.get(`${environment.apiUrl}/predio_complements/?predio=${id}`)

  }

  getUbigeo(){
    return this.http.get(`${environment.apiUrl}/ubigeos/activos/`)
  }
  getDireccion(id){
    return this.http.get(`${environment.apiUrl}/predios_urbanos/${id}/`)
  }

  list(id: string){
    
    return this.http.get(`${environment.apiUrl}/predio_complements/?predio=${id}`)
      .pipe(
        map((resp: { results: Array<PredioComplementos> }) => resp.results)
      ); 
  }

  updatePredio(id: string, data: any){
    
    return this.http.patch<any>(`${environment.apiUrl}/predios/${id}/`, data)
  }

  delete(id: string){
    
    return this.http.delete<any>(`${environment.apiUrl}/predio_complements/${id}/`)
  }

  //obtener el tipo via de la dirección
  getTipoVia(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_via/`);
  }

  


  





}
