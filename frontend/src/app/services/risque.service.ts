import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Risque } from '../model/Risque';

@Injectable({
  providedIn: 'root'
})
export class RisqueService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllRisques() {

    return this.http.get<Risque[]>(`${this.apiRoot}/risque/allRisques`);
  }
  getRisquePolice(numpol) {

    return this.http.get(`${this.apiRoot}/risque/getRisquePolice/${numpol}`);
  }
  addRisque(risque: Risque) {
    return this.http.post(`${this.apiRoot}/risque/addRisque`, risque);
  }
  modifRisque(risque: Risque) {
    return this.http.put(`${this.apiRoot}/risque/editRisque`, risque);
  }

  deleteRisque(id: Number) {

    return this.http.delete<Risque>(`${this.apiRoot}/risque/delete/${id}`);
  }

  getRisqueByNumero(numero: Number) {

    return this.http.get(`${this.apiRoot}/risque/risqueById/${numero}`);
  }

}
