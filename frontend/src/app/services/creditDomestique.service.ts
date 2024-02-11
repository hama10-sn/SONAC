import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreditDomestique } from '../model/CreditDomestique';

@Injectable({
  providedIn: 'root'
})
export class CreditDomestiqueService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllCreditDomestiques() {

    return this.http.get<CreditDomestique[]>(`${this.apiRoot}/creditDomestique/allCreditDomestiques`);
  }
  addCreditDomestique(creditDomestique: CreditDomestique) {
    return this.http.post(`${this.apiRoot}/creditDomestique/addCreditDomestique`, creditDomestique);
  }
  // modifCreditDomestique(creditDomestique: CreditDomestique) {
  //   return this.http.put(`${this.apiRoot}/creditDomestique/editCreditDomestique`, creditDomestique);
  // }

  deleteCreditDomestique(id: Number) {

    return this.http.delete<CreditDomestique>(`${this.apiRoot}/creditDomestique/delete/${id}`);
  }

}
