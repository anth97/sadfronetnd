import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { PersonaJuridica } from '../../interfaces/contribuyente/personaJuridica.interface';
import { PersonaJuridicaTwo } from '../../interfaces/contribuyente/personaJuridicaTwo.interface';
import { PersonaJuridicaThree } from '../../interfaces/contribuyente/personaJuridicaThree.interface';
import { Ubigeo } from '../../interfaces/contribuyente/ubigeo.interface';

import { map } from 'rxjs/operators';

const base_url = environment.apiUrl; 

@Injectable({
  providedIn: 'root'
})
export class PersonaJuridicaService {

  constructor(private http: HttpClient) { }
  list(){
    const url = `${base_url}/creates_juridico/`;
    return this.http.get<any>(url)
      .pipe(
        map((resp: { results: Array<PersonaJuridica> }) => resp.results)
      ); 
  }
  

  listByIdRepresentante(id: string){
    return this.http.get(`${environment.apiUrl}/personas_naturales/${id}/`);
  }


  create(object: PersonaJuridica){
    const url = `${base_url}/creates_juridico/`;
    return this.http.post<any>(url, object)
  }
  createTwo(object: PersonaJuridicaTwo){
    const url = `${base_url}/creates_juridico_two/`;
    return this.http.post<any>(url, object)
  }
  createThree(object: PersonaJuridicaThree){
    const url = `${base_url}/creates_juridico_three/`;
    return this.http.post<any>(url, object)
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
  
  getTipoDoc(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_doc/`);
  }
  getTipoVia(){
    return this.http.get(`${environment.apiUrl}/tablas_maestras/tipo_via/`);
  }

  getRepresentanteLegal(num_iden: string){
    return this.http.get(`${environment.apiUrl}/personas_naturales/?search=${num_iden}`);
  }
  getPersonaJuridica(ruc: string){
    console.log(`${environment.apiUrl}/personas_juridicas/?search=${ruc}`)
    return this.http.get(`${environment.apiUrl}/personas_juridicas/?search=${ruc}`);
  }

  searchDepartamento(distrito: string, provincia: string, departamento: string){
    return this.http.get(`${environment.apiUrl}/ubigeos/?codigo_depart=${distrito}&codigo_prov=${provincia}&codigo_dist=${departamento}&page_size=100`);
  }
}
