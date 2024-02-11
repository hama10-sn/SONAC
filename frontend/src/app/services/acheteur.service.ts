import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Acheteur } from '../model/Acheteur';

@Injectable({
  providedIn: 'root'
})
export class AcheteurService {
  apiRoot: String;
  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }


  getAllAcheteurs() {

    return this.http.get<Acheteur[]>(`${this.apiRoot}/acheteur/allAcheteurs`);
  }

  
  getAllAcheteursByClientPolice(numclient:any,numpolice:any) {

    return this.http.get<Acheteur[]>(`${this.apiRoot}/acheteur/acheteurbyclientandpoliceP/${numclient}/${numpolice}`);
  }

  getAcheteur(numachet) {

    return this.http.get(`${this.apiRoot}/acheteur/getAcheteur/${numachet}`);
  }

  findAcheteurByNumero(numachet: any) {

    return this.http.get(`${this.apiRoot}/acheteur/findAcheteurByNumero/${numachet}`);
  }

  addAcheteur(acheteur: Acheteur) {
    return this.http.post(`${this.apiRoot}/acheteur/addAcheteur`, acheteur);
  }
  modifAcheteur(acheteur: Acheteur) {
    return this.http.put(`${this.apiRoot}/acheteur/editAcheteur`, acheteur);
  }

  deleteAcheteur(id: Number) {

    return this.http.delete<Acheteur>(`${this.apiRoot}/acheteur/delete/${id}`);
  }
  generateReportAcheteur(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/acheteur/report/${format}`, formData, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  getAllAcheteurByPolice(id:any) {

    return this.http.get<any>(`${this.apiRoot}/acheteur/allAcheteurByPolice/${id}`);
  }
  getAcheteurByNum(numachet) {

    return this.http.get(`${this.apiRoot}/acheteur/getAcheteurByNum/${numachet}`);
  }

  getAcheteursByClientAndPolice(numclient: any, numpolice: any) {

    return this.http.get(`${this.apiRoot}/acheteur/acheteurbyclientandpolice/${numclient}/${numpolice}`);
  }

  findAllAcheteurs() {
    return this.http.get(`${this.apiRoot}/acheteur/findAllAcheteurs`);
  }

}
