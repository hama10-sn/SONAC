import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Accessoire } from '../model/Accessoire';

// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
} ; 

@Injectable({
  providedIn: 'root'
})
export class AccessoireService {

    apiRoot: string ;

  constructor(private httpClient: HttpClient) { 
      this.apiRoot = environment.apiUrl ;
  }

  
  getAllAccessoires(): Observable<Accessoire[]> {
    return this.httpClient.get<Accessoire[]>(`${this.apiRoot}/accessoire/allaccessoire`) ;
  }

  addAccesoire(accessoire: Accessoire): Observable<Accessoire> {
      return this.httpClient.post<Accessoire>(`${this.apiRoot}/accessoire/addaccessoire`, accessoire, httpOptions);
  }

  updateAccessoire(id: number, accessoire: Accessoire) {
    return this.httpClient.put<Accessoire>(`${this.apiRoot}/accessoire/updateAccessoire/${id}`, accessoire, httpOptions) ;
  } 

  lastID(numproduit:any, codeapporteur: any){
    return this.httpClient.get(`${this.apiRoot}/accessoire/lastID/${numproduit}/${codeapporteur}`);
  }
  deleteAccessoire(num: number) {
    return this.httpClient.delete(`${this.apiRoot}/accessoire/deleteAccessoire/${num}`);
  }
}
