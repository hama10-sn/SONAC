import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Pays } from '../model/pays';

@Injectable({
  providedIn: 'root'
})
export class PaysService {
  apiRoot: String;

  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
/*
  l'API qui nous permet de recevoir la liste des pays
  */
  getAllPays() {

    return this.http.get<Pays[]>(`${this.apiRoot}/pays/allPays`);
  }
  /*
  l'API qui nous permet d'ajouter un pays
  */
  addPays(pays: any){
    console.log(pays)
    return this.http.post(`${this.apiRoot}/pays/addPays`,pays);
  }
  /*
  l'API qui nous permet de recevoir un pays
  */
  getPays(id: number) {

    return this.http.get<Pays>(`${this.apiRoot}/pays/findbyPays/${id}`);
  }

  getLibelleByPays(pays_code: number) {

    return this.http.get <String>(`${this.apiRoot}/pays/libelle/${pays_code}`);
  }
  /*
  l'API qui nous permet de modifier un pays
  */
  update(pays:any) {
    return this.http.put<Pays>(`${this.apiRoot}/pays/update`,pays);
  }
}
