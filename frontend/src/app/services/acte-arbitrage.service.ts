import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActeArbitrage } from '../model/Acte_arbitrage';


// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
} ; 
@Injectable({
  providedIn: 'root'
})
export class ActeArbitrageService {
  apiRoot: string;

  constructor(private httpClient: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }

  
  addActeArbitrage(acte: ActeArbitrage): Observable<ActeArbitrage> {
    return this.httpClient.post<ActeArbitrage>(`${this.apiRoot}/acteArbitrage/addActe`, acte, httpOptions);
  }

  updateActeArbitrage(acte: ActeArbitrage) {
    return this.httpClient.put<ActeArbitrage>(`${this.apiRoot}/acteArbitrage/update`, acte, httpOptions) ;
  } 

  getByNumDamandeTypeDemandeTypeProduit(actedemnum : number,actetypedem :string): Observable<ActeArbitrage[]> {
    return this.httpClient.get<ActeArbitrage[]>(`${this.apiRoot}/acteArbitrage/acteArbitrage/${actedemnum}/${actetypedem}`) ;
  }
  
}
