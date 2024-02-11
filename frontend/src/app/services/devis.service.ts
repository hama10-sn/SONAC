import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Devis } from '../model/Devis';

@Injectable({
  providedIn: 'root'
})
export class DevisService {

  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }

  getAllDevis() {
    return this.http.get<Devis[]>(`${this.apiRoot}/devis/allDevis`);
  }

  addDevis(devis: Devis) {
    return this.http.post(`${this.apiRoot}/devis/addDevis`, devis);
  }
  modifDevis(devis: Devis) {
    return this.http.put(`${this.apiRoot}/devis/editDevis`, devis);
  }
  delDevis(numero: Number) {
    return this.http.get(`${this.apiRoot}/devis/delDevis/${numero}`);
  }

  getAllDevisByClient() {
    return this.http.get<Devis[]>(`${this.apiRoot}/devis/getDevisByClient`);
  }

}
