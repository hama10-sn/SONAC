import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Branche } from '../model/Branche';

// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
} ;

@Injectable({
  providedIn: 'root'
})
export class BrancheService {

    apiRoot: string ;

  constructor(private httpClient: HttpClient) {
      this.apiRoot = environment.apiUrl ;
  }

  getAllBranches(): Observable<Branche[]> {
      return this.httpClient.get<Branche[]>(`${this.apiRoot}/branche/allbranche`) ;
  }

  getBranche(numero: number): Observable<Branche> {
    return this.httpClient.get<Branche>(`${this.apiRoot}/branche/findBrancheByNumero/${numero}`) ;
  }

  getBrancheByNumero(numero: number) {
    return this.httpClient.get(`${this.apiRoot}/branche/getBrancheByNumero/${numero}`) ;
  }

  addBranche(branche: Branche): Observable<Branche> {
      return this.httpClient.post<Branche>(`${this.apiRoot}/branche/addbranche`, branche, httpOptions);
  }

  updateBranche(branche: Branche) {
    return this.httpClient.put<Branche>(`${this.apiRoot}/branche/updateBranche`, branche, httpOptions) ;
  }

  deleteBranche(numero: Number) {

    return this.httpClient.delete<Branche>(`${this.apiRoot}/branche/deleteBranche/${numero}`);
  }

  verifDeleteBranche(num: Number) {
    return this.httpClient.get(`${this.apiRoot}/branche/verifDeleteBranche/${num}`);
  }
  generateReportBranche(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.httpClient.post<any>(`${this.apiRoot}/branche/report/${format}`, formData, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
}
