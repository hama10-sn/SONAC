import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Groupe } from '../model/Groupe';

@Injectable({
  providedIn: 'root'
})
export class GroupeService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllGroupes() {

    return this.http.get<Groupe[]>(`${this.apiRoot}/groupe/allGroupes`);
  }
  addGroupe(groupe: Groupe) {
    return this.http.post(`${this.apiRoot}/groupe/addGroupe`, groupe);
  }
  modifGroupe(groupe: Groupe) {
    return this.http.put(`${this.apiRoot}/groupe/editGroupe`, groupe);
  }
  delGroupe(code: Number) {
    return this.http.get(`${this.apiRoot}/groupe/delGroupe/${code}`);
  }
  verifDel(code: Number) {
    return this.http.get(`${this.apiRoot}/groupe/verifDdelGroupe/${code}`);
  }
}
