import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Intermediaire } from "../model/Intermediaire";

// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
} ; 

@Injectable({
  providedIn: 'root'
})
export class IntermediaireService {

    apiRoot: string ;

  constructor(private httpClient: HttpClient) { 
      this.apiRoot = environment.apiUrl ;
  }

  getAllIntermediaires(): Observable<Intermediaire[]> {
      return this.httpClient.get<Intermediaire[]>(`${this.apiRoot}/intermediaire/allintermediaire`) ;
  }

  getIntemediaire(numInter) {
    return this.httpClient.get(`${this.apiRoot}/intermediaire/getIntermediaire/${numInter}`) ;
}

  addIntermediaire(intermediaire: Intermediaire): Observable<Intermediaire> {
      return this.httpClient.post<Intermediaire>(`${this.apiRoot}/intermediaire/addintermediaire`, intermediaire, httpOptions);
  }

  updateIntermediaire(intermediaire: Intermediaire) {
    return this.httpClient.put<Intermediaire>(`${this.apiRoot}/intermediaire/updateIntermediaire`, intermediaire, httpOptions) ;
  } 

  delIntermediaire(num: Number) {
    return this.httpClient.get(`${this.apiRoot}/intermediaire/deleteIntermediaire/${num}`);
  }

  verifDeleteIntermediaire(num: Number) {
    return this.httpClient.get(`${this.apiRoot}/intermediaire/verifDeleteIntermediaire/${num}`);
  }

  generateReportIntermediaire(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.httpClient.post<any>(`${this.apiRoot}/intermediaire/report/${format}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
}
