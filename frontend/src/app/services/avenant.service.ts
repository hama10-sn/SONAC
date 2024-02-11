import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Avenant } from '../model/Avenant';

@Injectable({
  providedIn: 'root'
})
export class AvenantService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllAvenants() {

    return this.http.get<Avenant[]>(`${this.apiRoot}/avenant/allAvenants`);
  }
  addAvenant(avenant: Avenant) {
    return this.http.post(`${this.apiRoot}/avenant/addAvenant`, avenant);
  }
  modifAvenant(avenant: Avenant) {
    return this.http.put(`${this.apiRoot}/avenant/editAvenant`, avenant);
  }
  dellAvenant(code: Number) {
    return this.http.get(`${this.apiRoot}/avenant/dellAvenant/${code}`);
  }
}
