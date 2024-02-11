import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Produit } from '../model/Produit';

// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
} ;

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

    apiRoot: string ;

  constructor(private httpClient: HttpClient) {
      this.apiRoot = environment.apiUrl ;
  }


  getAllProduits(): Observable<Produit[]> {
    return this.httpClient.get<Produit[]>(`${this.apiRoot}/produit/allproduit`) ;
}
getProduit(numprod){
  return this.httpClient.get(`${this.apiRoot}/produit/findByCode/${numprod}`) ;
}

  addProduit(produit: Produit): Observable<Produit> {
      return this.httpClient.post<Produit>(`${this.apiRoot}/produit/addproduit`, produit, httpOptions);
  }

  updateProduit(produit: Produit) {
    return this.httpClient.put<Produit>(`${this.apiRoot}/produit/updateProduit`, produit, httpOptions) ;
  }

  lastID(numcategorie:any){
    return this.httpClient.get(`${this.apiRoot}/produit/lastID/${numcategorie}`);
  }

  getAllProduitByCategorie(categorie:any){
    return this.httpClient.get(`${this.apiRoot}/produit/findByCodeCategorie/${categorie}`);
  }

  getProduitByPolice(police:any){
    return this.httpClient.get(`${this.apiRoot}/produit/findProduitByPolice/${police}`);
  }

  generateReportProduit(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.httpClient.post<any>(`${this.apiRoot}/produit/report/${format}`, formData, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  getProduitByNumero(numero: any) {
    return this.httpClient.get(`${this.apiRoot}/produit/getProduitByNumero/${numero}`) ;
  }
}
