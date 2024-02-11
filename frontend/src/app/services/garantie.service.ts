import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Garantie } from '../model/Garantie';

@Injectable({
  providedIn: 'root'
})
export class GarantieService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllGarantie() {

    return this.http.get<Garantie[]>(`${this.apiRoot}/garantie/allGaranties`);
  }
  addGarantie(garantie: Garantie) {
    return this.http.post(`${this.apiRoot}/garantie/addgarantie`, garantie);
  }
  modifGarantie(garantie: Garantie) {
    return this.http.put(`${this.apiRoot}/garantie/editGarantie`, garantie);
  }

}
