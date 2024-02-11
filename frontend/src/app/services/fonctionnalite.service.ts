import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Fonctionnalite } from '../model/Fonctionnalite';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FonctionnaliteService {


  apiRoot: String;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  getFonctionnaliteByName(fonctionnalite: String) {

    return this.http.get<Fonctionnalite>(`${this.apiRoot}/fonctionnalite/findByName/${fonctionnalite}`);
  }

  getAllFonctionnalites() {

    return this.http.get<Fonctionnalite[]>(`${this.apiRoot}/fonctionnalite/allFonctionnalites`);
  }
  addFonctionnalite(fonctionnalite: Fonctionnalite) {

    return this.http.post<Fonctionnalite>(`${this.apiRoot}/fonctionnalite/addFonctionnalite`, fonctionnalite);
  }
  updateFonctionnalites(fonctionnalite: Fonctionnalite, id: Number) {

    return this.http.put<Fonctionnalite>(`${this.apiRoot}/fonctionnalite/update/${id}`, fonctionnalite);
  }

  deleteFonctionnalite(id: Number) {

    return this.http.delete<Fonctionnalite>(`${this.apiRoot}/fonctionnalite/delete/${id}`);
  }

}
