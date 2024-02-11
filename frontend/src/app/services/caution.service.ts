import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Caution } from '../model/Caution';

@Injectable({
  providedIn: 'root'
})
export class CautionService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllCautions() {

    return this.http.get<Caution[]>(`${this.apiRoot}/caution/allCautions`);
  }
  addCaution(caution: Caution) {
    return this.http.post(`${this.apiRoot}/caution/addCaution`, caution);
  }
  // modifCaution(caution: Caution) {
  //   return this.http.put(`${this.apiRoot}/caution/editCaution`, caution);
  // }

  deleteCaution(id: Number) {

    return this.http.delete<Caution>(`${this.apiRoot}/caution/delete/${id}`);
  }

}
