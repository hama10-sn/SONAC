import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Civilite } from '../model/Civilite';

@Injectable({
  providedIn: 'root'
})
export class CiviliteService {

  apiRoot: String;

  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  /*
  l'API qui nous permet de recevoir la liste des civilite
  */
  getAllCivilite() {

    return this.http.get<Civilite[]>(`${this.apiRoot}/civilite/allcivilite`);
  }
  /*
  l'API qui nous permet d'ajouter une civilite
  */
  addCivilite(civilite: any){
    //console.log(civilite)
    return this.http.post(`${this.apiRoot}/civilite/addCivilite`,civilite);
  }
  /*
  l'API qui nous permet de modifier une civilite
  */
  update(civilite:any) {
    return this.http.put<Civilite>(`${this.apiRoot}/civilite/update`,civilite);
  }

  /*
  l'API qui nous permet de filtrer la liste des civilités par nature de la personne
  */
  getAllCiviliteByNature(nature: number) {

    return this.http.get<Civilite[]>(`${this.apiRoot}/civilite/allciviliteByNature/${nature}`);
  }
}
