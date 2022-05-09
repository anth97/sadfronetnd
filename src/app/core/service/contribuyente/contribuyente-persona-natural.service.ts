import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { PersonaNatural } from '../../interfaces/contribuyente/personaNatural.interface';
import { PersonaNaturalTwo } from '../../interfaces/contribuyente/personaNaturalTwo.interface';
import { PersonaNaturalThree } from '../../interfaces/contribuyente/personaNaturalThree.interface';
import { PersonaNaturalFour } from '../../interfaces/contribuyente/personaNaturalFour.interface';

import { map } from 'rxjs/operators';

const base_url = environment.apiUrl; 

@Injectable({
  providedIn: 'root'
})
export class PersonaNaturalService {

  constructor(private http: HttpClient) { }


  list(){
    const url = `${base_url}/creates_persons_naturals/`;
    return this.http.get<any>(url)
      .pipe(
        map((resp: { results: Array<PersonaNatural> }) => resp.results)
      ); 
  }


  listById(id: string){
    const url =`${base_url}/creates_persons_naturals/${id}/`;
    return this.http.get<any>(url)
  }


  create(object: PersonaNatural){
    const url = `${base_url}/creates_persons_naturals/`;
    return this.http.post<any>(url, object)
  }

  createTwo(object: PersonaNaturalTwo){
    const url = `${base_url}/creates_persons_naturals_two/`;
    return this.http.post<any>(url, object)
  }
  createThree(object: PersonaNaturalThree){
    const url = `${base_url}/creates_persons_naturals_three/`;
    return this.http.post<any>(url, object)
  }

  createFour(object: PersonaNaturalFour){
    const url = `${base_url}/creates_persons_naturals_four/`;
    return this.http.post<any>(url, object)
  }

  getTablaMaestra(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/`);
  }
  //tipo_via
  getTipoVia(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_via/`);
  }

  
  getSexo(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/sexo/`);
  }

  getEstadoCivil(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/estado_civil/`);
  }

  getTipoDoc(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_doc/`);
  }

  getPropiedadPredio(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/propiedad_predio/`);
  }
  getTipoUso(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_uso/`);
  }

  getDepartamentos(){
    return this.http.get(`${environment.apiUrl}/ubigeos/?codigo_depart=&codigo_prov=00&codigo_dist=00&page_size=100`);
  }
  
  getProvincias(departamento: string){
    return this.http.get(departamento);
  }

  getDistritos(distrito: string){
    return this.http.get(distrito);
  }
  getProvinciasInfo(codigo_depart : string){
    return this.http.get(`${environment.apiUrl}/ubigeos/?codigo_depart=${codigo_depart}&codigo_prov=&codigo_dist=00&page_size=100`);
  }
getDistritosInfo(codigo_depart: string, codigo_prov : string){
    return this.http.get(`${environment.apiUrl}/ubigeos/?codigo_depart=${codigo_depart}
    &codigo_prov=${codigo_prov}&codigo_dist=&page_size=100`);
  }

  getPersonaNatural(doc_iden: String){
    console.log(`${environment.apiUrl}/personas_naturales/?search=${doc_iden}`)
    return this.http.get(`${environment.apiUrl}/personas_naturales/?search=${doc_iden}`);
  }

  searchDepartamento(distrito: string, provincia: string, departamento: string){
    return this.http.get(`${environment.apiUrl}/ubigeos/?codigo_depart=${distrito}&codigo_prov=${provincia}&codigo_dist=${departamento}&page_size=100`);
  }
}