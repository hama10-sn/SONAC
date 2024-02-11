import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categorie } from '../model/Categorie';

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  apiRoot: String;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }
  /*
  l'API qui nous permet de recevoir la liste des categorie
  */
  getAllCategorie() {

    return this.http.get<Categorie[]>(`${this.apiRoot}/categorie/allCategorie`);
  }
  /*
  l'API qui nous permet d'ajouter une categorie
  */
  addCategorie(categorie: any){
    console.log(categorie)
    return this.http.post(`${this.apiRoot}/categorie/addCategorie`,categorie);
  }
  /*
  l'API qui nous permet de modifier une categorie
  */
  update(categorie:any) {
    return this.http.put<Categorie>(`${this.apiRoot}/categorie/update`,categorie);
  }

  lastID(branche:any){
    return this.http.get(`${this.apiRoot}/categorie/lastID/${branche}`);
  }
  getAllCategorieBranche(branche:any) {

    return this.http.get<Categorie[]>(`${this.apiRoot}/categorie/branchCategorie/${branche}`);
  }
  deleteCategorie(id: Number) {

    return this.http.get<Categorie>(`${this.apiRoot}/categorie/delete/${id}`);
  }
  checkCategorie(id: Number) {

    return this.http.get<any>(`${this.apiRoot}/categorie/checkID/${id}`);
  }
  generateReportCategorie(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/categorie/report/${format}`, formData, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  getCategorieByNumero(numero: any) {
    return this.http.get(`${this.apiRoot}/categorie/getCategorieByNumero/${numero}`) ;
  }
}
