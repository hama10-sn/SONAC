import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Propos } from '../model/Propos';

@Injectable({
  providedIn: 'root'
})
export class ProposService {apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  /*
  l'API qui nous permet de lister les reassureur
  */
  getAllProposition() {

    return this.http.get<Propos []>(`${this.apiRoot}/Propos/allPropos`);
  }
  /*
  l'API qui nous permet d'ajouter un reassureur
  */
  addProposition(propos: any){
    //console.log(reassureur)
    return this.http.post(`${this.apiRoot}/Propos/addPropos`,propos);
  }
  /*
  l'API qui nous permet de modifier un reassureur
  */
  update(propos:any) {
    return this.http.put<Propos>(`${this.apiRoot}/Propos/updatePropos`,propos);
  }
  /*
  l'API qui nous permet de supprimer un reassureur
  */
  deleteProposition(id: String) {
    return this.http.delete<Propos>(`${this.apiRoot}/Propos/delete/${id}`);
  }
}
