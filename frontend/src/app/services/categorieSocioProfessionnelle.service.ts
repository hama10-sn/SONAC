import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Branche } from '../model/Branche';
import { CategorieSocioprofessionnelle } from '../model/CategorieSocioprofessionnelle';

// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
} ; 

@Injectable({
  providedIn: 'root'
})
export class CategorieSocioprofessionnelleService {

    apiRoot: string ;

  constructor(private httpClient: HttpClient) { 
      this.apiRoot = environment.apiUrl ;
  }

  getAllCategorieSocioprofessionnelle(): Observable<CategorieSocioprofessionnelle[]> {
      return this.httpClient.get<CategorieSocioprofessionnelle[]>(`${this.apiRoot}/categoriesocioprofessionnelle/allcategoriesociopro`) ;

     // return this.http.get<User[]>(`${this.apiRoot}/utilisateur/allUsers`);
  }

  // getBranche(numero: number): Observable<Branche> {
  //   return this.httpClient.get<Branche>(`${this.apiRoot}/branche/findByNumero/${numero}`) ;
  // }

  addCategorieSocioProfessionnelle(categorie: CategorieSocioprofessionnelle): Observable<CategorieSocioprofessionnelle> {
      return this.httpClient.post<CategorieSocioprofessionnelle>(`${this.apiRoot}/categoriesocioprofessionnelle/addcategoriesociopro`, categorie, httpOptions);
  }

  updateCategorieSocioprofessionnelle(categorie: CategorieSocioprofessionnelle) {
    return this.httpClient.put<CategorieSocioprofessionnelle>(`${this.apiRoot}/categoriesocioprofessionnelle/updatecategoriesocioprofessionnelle`, categorie, httpOptions) ;
  } 

  getCategorieSocioprofessionnelleByCode(code:any): Observable<CategorieSocioprofessionnelle> {
    return this.httpClient.get<CategorieSocioprofessionnelle>(`${this.apiRoot}/categoriesocioprofessionnelle/findbycode/${code}`) ;

   // return this.http.get<User[]>(`${this.apiRoot}/utilisateur/allUsers`);
}

}
