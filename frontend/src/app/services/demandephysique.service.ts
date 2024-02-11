import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Url } from 'url';
import { environment } from '../../environments/environment';
import { Dem_Pers } from '../model/dem_Pers';

@Injectable({
  providedIn: 'root'
})
export class DemandephysiqueService {

  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  
  getAllDemandePhysique() {

    return this.http.get<Dem_Pers[]>(`${this.apiRoot}/dempers/allDemPers`);
  }
  getAllValideDemandePhysique() {

    return this.http.get<Dem_Pers[]>(`${this.apiRoot}/dempers/allValideDemPers`);
  }
  getAllPresEmissionDemandePhysique() {

    return this.http.get<Dem_Pers[]>(`${this.apiRoot}/dempers/allPresEmmisionDemPers`);
  }
  addDemandePhysiqu(demande: Dem_Pers) {
    return this.http.post<Dem_Pers>(`${this.apiRoot}/dempers/addDemPers`, demande);
  }
  update(demande: Dem_Pers) {
    return this.http.put<Dem_Pers>(`${this.apiRoot}/dempers/update/`, demande);
  }
  deleteDemande(id: Number) {

    return this.http.delete<Dem_Pers>(`${this.apiRoot}/dempers/delete/${id}`);
  }
      
  //gestion dossier

  uploadDoc(formData: FormData,numDemande:any): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.apiRoot}/dempers/upload/${numDemande}`, formData , {
      reportProgress: true,
      observe: 'events'
    }); 
  }
  
  getFilesDoc (numDemande:any) {
    return this.http.get(`${this.apiRoot}/dempers/getFiles/${numDemande}`);
  }

  downloadDoc(filename: string,numDemande:any): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiRoot}/dempers/download/${numDemande}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }); 
  }
  deleteFileDoc (filename: string,numDemande:any) {
    return this.http.get(`${this.apiRoot}/dempers/delete/${numDemande}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
  }
  generateReportSoumission(id:any){
    return this.http.get(`${this.apiRoot}/dempers/report/soumission/${id}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateReportConditionGenerale(id:any){
    return this.http.get(`${this.apiRoot}/dempers/report/conditionGenerale/${id}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportConditionParticuliere(id:any){
    return this.http.get(`${this.apiRoot}/dempers/report/conditionParticuliere/${id}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateReportInstruction(id:any,demandeur : string){
    return this.http.get(`${this.apiRoot}/dempers/report/instruction/${id}/${demandeur}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateReportInstruction1(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/instruction/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  

  getFilesuri (filename: string,numDemande:any) {
    return this.http.get(`${this.apiRoot}/dempers/url/${numDemande}/${filename}`);
  }


  
  downloadInDossier(filename: string,numDemande:any): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiRoot}/dempers/downloadI/${numDemande}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }); 
  }

  generateReportInstructionCredit(id:any){
    return this.http.get(`${this.apiRoot}/dempers/report/instructionCredit/${id}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportInstructionCredit1(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/instructionCredit/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportInstructionPerte(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/instructionPerte/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateReportActeAd(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/acteAd/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActesoumission(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/acteSoumis/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActedefinitive(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/acteDefinitive/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActeBonneExecution(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/acteBnExecution/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActeRetenueGarantie(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/acteRetenueG/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActeCredit(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/acteCredit/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActeLocassur(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/dempers/report/acteLocassur/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
}


