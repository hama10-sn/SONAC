import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Cimacodificationcompagnie } from '../model/Cimacodificationcompagnie';

@Injectable({
  providedIn: 'root'
})
export class CimacompagnieService {

  apiRoot: String;

  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  /*
  l'API qui nous permet de recevoir la liste des Cima
  */
  getAllCimaCompagnie() {

    return this.http.get<Cimacodificationcompagnie[]>(`${this.apiRoot}/cima/allCima`);
  }
  /*
  l'API qui nous permet d'ajouter une CimaCompagnie
  */
  addCimaCompagnie(cimaCompagnie: any){
    return this.http.post(`${this.apiRoot}/cima/addCima`,cimaCompagnie);
  }
  /*
  l'API qui nous permet de modifier une Cima
  */
  update(cimaCompagnie:any) {
    return this.http.put<Cimacodificationcompagnie>(`${this.apiRoot}/cima/update`,cimaCompagnie);
  }
}
