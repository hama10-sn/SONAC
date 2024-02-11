import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Engagement } from '../model/Engagement';

@Injectable({
  providedIn: 'root'
})
export class EngagementService {

  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  getAllEngagements() {

    return this.http.get<Engagement[]>(`${this.apiRoot}/engagement/allEngagement`);
  }

  getEngagementByNumero(numero: Number) {
    return this.http.get<any>(`${this.apiRoot}/engagement/engagementbynumero/${numero}`);
  }

  addEngagement(engag: Engagement) {
    return this.http.post<Engagement>(`${this.apiRoot}/engagement/addEngagement`, engag);
  }
  update(engag: Engagement) {
    return this.http.put<Engagement>(`${this.apiRoot}/engagement/update`, engag);
  }
  deleteEngagement(id: Number) {

    return this.http.delete<Engagement>(`${this.apiRoot}/engagement/delete/${id}`);
  }

  //engagement by police
  getAllEngagementsByPolice(id: Number) {

    return this.http.get<Engagement[]>(`${this.apiRoot}/engagement/allengagementByPolice/${id}`);
  }
  
  lastID(acte:any){
    return this.http.get(`${this.apiRoot}/engagement/lastID/${acte}`);
  }

  listeEngagements() {
    return this.http.get(`${this.apiRoot}/engagement/listeAllEngagements`);
  }

  listeEngagementsParPolice(numPolice: number) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsByPolice/${numPolice}`);
  }

  listeEngagementsParBranche(numBranche: number) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsByBranche/${numBranche}`);
  }

  listeEngagementsParClient(numClient: number) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsByClient/${numClient}`);
  }

  listeEngagementsParPeriode(debut: string, fin: string) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsByPeriode/${debut}/${fin}`);
  }

  listeEngagementsParProduit(numProduit: number) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsParProduit/${numProduit}`);
  }

  listeEngagementsByPoliceAndBranche(numPolice: number, numBranche: number) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsByPoliceAndBranche/${numPolice}/${numBranche}`);
  }

  listeEngagementsByPoliceAndClient(numPolice: number, numClient: number) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsByPoliceAndClient/${numPolice}/${numClient}`);
  }

  listeEngagementsByPoliceAndPeriode(numPolice: number, debut: string, fin: string) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsByPoliceAndPeriode/${numPolice}/${debut}/${fin}`);
  }

  listeEngagementsByPoliceAndProduit(numPolice: number, numProduit: number) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsByPoliceAndProduit/${numPolice}/${numProduit}`);
  }

  listeEngagementsByPoliceAndBrancheAndClientAndPeriodeAndProduit(numPolice: number, numBranche: number, numClient: number, debut: string, fin: string, numProduit: number) {
    return this.http.get(`${this.apiRoot}/engagement/listeEngagementsByPoliceAndBrancheAndClientAndPeriode/${numPolice}/${numBranche}/${numClient}/${debut}/${fin}/${numProduit}`);
  }

  generateReportEngagement(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/reassureur/report/${format}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateReportConsultationEngagement(format: String, title: String, demandeur: string, numPolice: number, numBranche: number, numClient: number, debut: string, fin: string, numProduit: number) {
    return this.http.get(`${this.apiRoot}/engagement/report/consultation/${format}/${title}/${demandeur}/${numPolice}/${numBranche}/${numClient}/${debut}/${fin}/${numProduit}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

}
