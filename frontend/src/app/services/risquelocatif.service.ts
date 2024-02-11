import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Police } from '../model/Police';
import { RisqueLocatif } from '../model/RisqueLocatif';

@Injectable({
  providedIn: 'root'
})
export class RisqueLocatifService {
  apiRoot: String;
  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }


  getAllRisque_locatifs() {

    return this.http.get<RisqueLocatif[]>(`${this.apiRoot}/risque_locatif/allRisque_locatifs`);
  }
  addRisque_locatif(risque_locatif: RisqueLocatif) {
    return this.http.post(`${this.apiRoot}/risque_locatif/addRisque_locatif`, risque_locatif);
  }
  modifRisque_locatif(risque_locatif: RisqueLocatif) {
    return this.http.put(`${this.apiRoot}/risque_locatif/editRisque_locatif`, risque_locatif);
  }

  deleteRisque_locatif(id: Number) {

    return this.http.delete<RisqueLocatif>(`${this.apiRoot}/risque_locatif/delete/${id}`);
  }

  getRisque_locatifsByClientAndAcheteur(client: Number, acheteur: Number) {

    return this.http.get<any>(`${this.apiRoot}/risque_locatif/findRisqueLocatifByClientAndAcheteur/${client}/${acheteur}`);
  }

  getRisque_locatifsByClientAndPoliceAndAcheteur(client: Number, police: Number, acheteur: Number) {

    return this.http.get<any>(`${this.apiRoot}/risque_locatif/findRisqueLocatifByClientAndPoliceAndAcheteur/${client}/${police}/${acheteur}`);
  }

  getRisqueLocatifByNumero(numero: Number) {

    return this.http.get<any>(`${this.apiRoot}/risque_locatif/findRisqueLocatifById/${numero}`);
  }

}
