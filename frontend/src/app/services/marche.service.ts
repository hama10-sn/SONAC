import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Marche } from '../model/Marche';

@Injectable({
  providedIn: 'root'
})
export class MarcheService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllMarches() {

    return this.http.get<Marche[]>(`${this.apiRoot}/marche/allMarche`);
  }
  addMarche(marche: Marche) {
    return this.http.post(`${this.apiRoot}/marche/addMarche`, marche);
  }
  modifMarche(marche: Marche) {
    return this.http.put(`${this.apiRoot}/marche/editMarche`, marche);
  }
  dellMarche(code: Number) {
    return this.http.get(`${this.apiRoot}/marche/dellMarche/${code}`);
  }
  //police
  deleteMarche(id: Number) {

    return this.http.delete<Marche>(`${this.apiRoot}/marche/delete/${id}`);
  }
  getMarche(nuMarche) {

    return this.http.get(`${this.apiRoot}/marche/GetMarches/${nuMarche}`);
  }
}
