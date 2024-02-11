import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Credit } from '../model/Credit';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllCredits() {

    return this.http.get<Credit[]>(`${this.apiRoot}/credit/allCredits`);
  }
  addCredit(credit: Credit) {
    return this.http.post(`${this.apiRoot}/credit/addCredit`, credit);
  }
  modifCredit(credit: Credit) {
    return this.http.put(`${this.apiRoot}/credit/editCredit`, credit);
  }

  deleteCredit(id: Number) {

    return this.http.delete<Credit>(`${this.apiRoot}/credit/delete/${id}`);
  }

  getCreditByClientAndAcheteur(client: Number, acheteur: Number) {

    return this.http.get<any>(`${this.apiRoot}/credit/findCreditByClientAndAcheteur/${client}/${acheteur}`);
  }

  getCreditByNumero(numero: Number) {

    return this.http.get<any>(`${this.apiRoot}/credit/findCreditById/${numero}`);
  }

}
