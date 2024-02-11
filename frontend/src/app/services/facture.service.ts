import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Facture } from '../model/Facture';

@Injectable({
  providedIn: 'root'
})
export class FactureService {

  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  getAllFactures() {

    return this.http.get<Facture[]>(`${this.apiRoot}/facture/allFacture`);
  }
  addFacture(engag: Facture) {
    return this.http.post<Facture>(`${this.apiRoot}/facture/addFacture`, engag);
  }
  update(engag: Facture) {
    return this.http.put<Facture>(`${this.apiRoot}/facture/update`, engag);
  }
  deleteFacture(id: Number) {

    return this.http.delete<Facture>(`${this.apiRoot}/facture/delete/${id}`);
  }
  getFacture(numerofacture : Number) {

    return this.http.get<Facture>(`${this.apiRoot}/facture/getFacture/${numerofacture}`);
  } 
  getFactureByPolice(numpoli : Number) {

    return this.http.get<Facture>(`${this.apiRoot}/facture/maxFacturesByPolice/${numpoli}`);
  }
  isProductFacture(numerofacture : Number) {

    return this.http.get(`${this.apiRoot}/facture/isProductFacture/${numerofacture}`);
  }
  getAllFacturesPolice(numpol:any) {

    return this.http.get<Facture[]>(`${this.apiRoot}/facture/allFacturesPolice/${numpol}`);
  }
  getAllFacturesPoliceaEnc(numpol:any) {

    return this.http.get<Facture[]>(`${this.apiRoot}/facture/allFacturesPoliceaEnc/${numpol}`);
  }
  getAllFacturesAnnulPolice(numpol:any) {

    return this.http.get<Facture[]>(`${this.apiRoot}/facture/allFacturesAnnulPolice/${numpol}`);
  }
  getAllFacturesClient(numcli:any) {

    return this.http.get<Facture[]>(`${this.apiRoot}/facture/allFacturesClient/${numcli}`);
  }
  getAllFacturesIntermediaire(numInter:any) {

    return this.http.get<Facture[]>(`${this.apiRoot}/facture/allFacturesIntermediaire/${numInter}`);
  }
  annulerFacture(numerofacture : Number,typeAnnul) {

    return this.http.get(`${this.apiRoot}/facture/annulerFacture/${numerofacture}/${typeAnnul}`);
  }
   reemettreFactEcheanceSeule(police,type,numFactAnnul) {
    return this.http.post(`${this.apiRoot}/facture/reemettreFactEcheanceSeule/${type}/${numFactAnnul}`,police);
  
  }   //pour police
  reemettreFactEcheanceSeuleLaste(reemettre) {
    return this.http.post(`${this.apiRoot}/facture/reemettreFactEcheanceSeuleLaste`,reemettre);
  
  }
  deleteFactureForpolice(id: Number) {

    return this.http.delete<Facture>(`${this.apiRoot}/facture/deleteforpolice/${id}`);
  }
  getAllFacturesAnnul() {

    return this.http.get<Facture[]>(`${this.apiRoot}/facture/allFacturesAnnul`);
  }
  getAllFacturesEnProduction() {

    return this.http.get<Facture[]>(`${this.apiRoot}/facture/allFacturesEnProd`);
  }
}
