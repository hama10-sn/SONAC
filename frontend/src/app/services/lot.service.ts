import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Lot } from '../model/Lot';

@Injectable({
  providedIn: 'root'
})
export class LotService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllLots() {

    return this.http.get<Lot[]>(`${this.apiRoot}/lot/allLot`);
  }
  addLot(lot: Lot) {
    return this.http.post(`${this.apiRoot}/lot/addLot`, lot);
  }
  modifLot(lot: Lot) {
    return this.http.put(`${this.apiRoot}/lot/editLot`, lot);
  }
  dellLot(code: Number) {
    return this.http.get(`${this.apiRoot}/lot/dellLot/${code}`);
  }
}
