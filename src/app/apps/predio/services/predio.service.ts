import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const base_url = environment.apiUrl; 

@Injectable({
  providedIn: 'root'
})
export class PredioService {

  constructor(
    private http: HttpClient
  ) { }


  getUbigeo(){
    return this.http.get(`${environment.apiUrl}/ubigeos/activos/`)
  }

  crearPredio(data){
    return this.http.post(`${environment.apiUrl}/predios_urbanos/`, data)
  }
  crearPredioRustico(data){
    return this.http.post(`${environment.apiUrl}/predios_rusticos/`, data)
  }
  getPredioById(id){
    return this.http.get(`${environment.apiUrl}/predios_urbanos/${id}/`)
  }
  getPredioRusticoById(id){
    return this.http.get(`${environment.apiUrl}/predios_rusticos/${id}/`)
  }

  updatePredio(id, data){
    return this.http.patch(`${environment.apiUrl}/predios_urbanos/${id}/`, data)
  }
  edit (id: string, data: Object){
    const url = `${base_url}/predios_en_proceso/${id}/`;
    return this.http.patch<any>(url, data)
  }
  delete(id: string){
    const url = `${base_url}/predios_en_proceso/${id}/`;
    return this.http.delete<any>(url)
  }

  updatePredioUrbano(id, data){//dleete agora
    //no existe esta ruta.
    return this.http.patch(`${environment.apiUrl}/update_urbanos/${id}/`, data)
  }
  updatePredioRustico(id, data){
    //no existe esta ruta.
    return this.http.patch(`${environment.apiUrl}/update_rustico/${id}/`, data)
  }
  //tablas maestras
  getTablaMaestra(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/`);
  }

  //regiones
  getRegiones(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/region_peru/`);
  }

  //situacion formal
  getSituaciones(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/region_peru/`);
  }
  
  //situacion formal el verdadero que se usa.
  getCondicionPredio(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/propiedad_predio/`);
  }
  getCategoriaPredioRustico(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/cate_predio_rustico/`);
  }
  getGrupoAltitud(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/grupo_altitud/`);
  }
  getGrupoTierra(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/grupo_tierra/`);
  }
  getCodigoTipoExplotacion(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_explotacion/`);
  }

  getTipoZona(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_zona/`);
  }
  getCrearPredioFiscalizacion(data){
    return this.http.post(`${environment.apiUrl}/predio_fiscalizacion/`,data);
  }
  getListPredios(pagina){
    return this.http.get(`${environment.apiUrl}/predios_en_proceso/?es_eliminado=false&ordering=fec_mod&page=${pagina}`);
  }
  getListPrediosFiscalizacion(pagina){
    return this.http.get(`${environment.apiUrl}/fiscalizacion/`);
  }

  listTablaFiscalizacion(cod: string){
    const url = `${base_url}/tablas_maestras/personalizado/?tabla=${cod}`;
    return this.http.get<any>(url)
  }

  searchPredioFiscalizacion( filtros,pagina=1){
    return this.http.get(`${environment.apiUrl}/fiscalizacion/?page=${pagina}&${filtros}`);
  }
  getPredioFiszalizacionById(id){
    return this.http.get(`${environment.apiUrl}/fiscalizacion/${id}/`);
  }
  //estado_construcc
  getEstado(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/estado_construcc/`);
  }

  //tipo_via
  getTipoVia(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_via/`);
  }

  //clasif_predio
  //Ahora es uso predio
  getUsoPredio(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_uso/`);
  }

  //sector
  getSector(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/sector/`);
  }

  //tipo_predio
  getTipoPredio(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_predio/`);
  }

  getExplotacion(){
    return this.http.get(`${environment.apiUrl}/explotaciones/`);
  }

  //get Habilitaciones
  getHabilitaciones() {
    return this.http.get(`${environment.apiUrl}/habilitaciones_urbanas/`)
  }

  //get via ubicacion predio
  getViaUbigacion() {
    return this.http.get(`${environment.apiUrl}/via_ubicaciones/`)
  }
}
