import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Typage } from '../model/Typage';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypageService {


  apiRoot: String;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  getTypageByType(typage: String) {

    return this.http.get<Typage>(`${this.apiRoot}/typage/findByType/${typage}`);
  }

  getAllTypages() {

    return this.http.get<Typage[]>(`${this.apiRoot}/typage/allTypages`);
  }
  addTypage(type: Typage) {

    return this.http.post<Typage>(`${this.apiRoot}/typage/addTypage`, type);
  }
  updateTypages(type: Typage, id: Number) {

    return this.http.put<Typage>(`${this.apiRoot}/typage/update/${id}`, type);
  }

  deleteTypage(id: Number) {

    return this.http.delete<Typage>(`${this.apiRoot}/typage/delete/${id}`);
  }

}
