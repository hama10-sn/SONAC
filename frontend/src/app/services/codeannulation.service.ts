import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Accessoire } from '../model/Accessoire';
import { CodeAnnulationFact } from '../model/CodeAnnulationFact';

// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
} ; 

@Injectable({
  providedIn: 'root'
})
export class CodeAnnulationService {

    apiRoot: string ;

  constructor(private httpClient: HttpClient) { 
      this.apiRoot = environment.apiUrl ;
  }

  getAllCodeAnnulation(): Observable<CodeAnnulationFact[]> {
    return this.httpClient.get<CodeAnnulationFact[]>(`${this.apiRoot}/codeannulation/allcodeannulation`) ;
  }
  getCodeAnnulation(num){
    return this.httpClient.get<CodeAnnulationFact>(`${this.apiRoot}/codeannulation/getAnnulation/${num}`) ;
  }
  
}
