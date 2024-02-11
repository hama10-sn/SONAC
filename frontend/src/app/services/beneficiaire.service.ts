import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Beneficiaire } from '../model/Beneficiaire';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaireService {
  apiRoot: String;
  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }


  getAllBeneficiaires() {

    return this.http.get<Beneficiaire[]>(`${this.apiRoot}/beneficiaire/allBeneficiaires`);
  }

  findAllBeneficiaires() {

    return this.http.get(`${this.apiRoot}/beneficiaire/findAllBeneficiaire`);
  }

  getBeneficiaire(numbenef) {

    return this.http.get(`${this.apiRoot}/beneficiaire/GetBeneficiaires/${numbenef}`);
  }
  addBeneficiaire(beneficiaire: Beneficiaire) {
    return this.http.post(`${this.apiRoot}/beneficiaire/addBeneficiaire`, beneficiaire);
  }

  deleteBeneficiaire(id: Number) {
    return this.http.delete<Beneficiaire>(`${this.apiRoot}/beneficiaire/delete/${id}`);
  }

  getBeneficiaireWithActeByPolice(police: Number) {
    return this.http.get<any>(`${this.apiRoot}/beneficiaire/findBeneficiaireWithActeByPolice/${police}`);
  }

  findBeneficiaireByNum(numBenef: Number) {
    return this.http.get(`${this.apiRoot}/beneficiaire/findBeneficiaireByNum/${numBenef}`);
  }

  findBeneficiaireByDenomination(denomination: String) {
    return this.http.get(`${this.apiRoot}/beneficiaire/findBeneficiaireByDenomination/${denomination}`);
  }

  findBeneficiaireByNomAndPrenom(nom: String, prenom: String) {
    return this.http.get(`${this.apiRoot}/beneficiaire/findBeneficiaireByNomAndPrenom/${nom}/${prenom}`);
  }
}
