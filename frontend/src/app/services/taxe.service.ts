import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Taxe } from '../model/taxe';

@Injectable({
  providedIn: 'root'
})
export class TaxeService {
    apiRoot: String;

    constructor(private http: HttpClient) { 
      this.apiRoot = environment.apiUrl;
    }
  
    
  getAllTaxes() {
    return this.http.get<Taxe[]>(`${this.apiRoot}/taxe/allTaxes`);
  }
  addTaxe(taxe: Taxe) {
    return this.http.post<any>(`${this.apiRoot}/taxe/addTaxe`, taxe);
  }
  modifTaxe(id:Number,taxe: Taxe) {
    return this.http.put<Taxe>(`${this.apiRoot}/taxe/updateTaxe/${id}`, taxe);
  }
  lastID(categorie:any){
    return this.http.get(`${this.apiRoot}/taxe/lastID/${categorie}`);
  }
  lastIDProduit(produit:any){
    return this.http.get(`${this.apiRoot}/taxe/lastIDProduit/${produit}`);
  
}
  deleteTaxe(id: Number) {

    return this.http.delete<Taxe>(`${this.apiRoot}/taxe/delete/${id}`);
  }

  getAllTaxeByBranche(branche:any) {

    return this.http.get<Taxe[]>(`${this.apiRoot}/taxe/taxeByBranche/${branche}`);
  }
}
