import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RisqueReglemente } from '../model/RisqueReglemente';

@Injectable({
  providedIn: 'root'
})
export class RisqueReglementeService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllRisque_reglementes() {

    return this.http.get<RisqueReglemente[]>(`${this.apiRoot}/risque_reglemente/allRisque_reglementes`);
  }
  addRisque_reglemente(risque_reglemente: RisqueReglemente) {
    return this.http.post(`${this.apiRoot}/risque_reglemente/addRisque_reglemente`, risque_reglemente);
  }
  modifRisque_reglemente(risque_reglemente: RisqueReglemente) {
    return this.http.put(`${this.apiRoot}/risque_reglemente/editRisque_reglemente`, risque_reglemente);
  }

  deleteRisque_reglemente(id: Number) {

    return this.http.delete<RisqueReglemente>(`${this.apiRoot}/risque_reglemente/delete/${id}`);
  }

}
