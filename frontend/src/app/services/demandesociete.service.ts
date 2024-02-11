import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Dem_Soc } from '../model/Dem_Soc';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandesocieteService {

  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  
  getAllDemandeSociete() {

    return this.http.get<Dem_Soc[]>(`${this.apiRoot}/DemSoc/allDemSoc`);
  }
  addDemandeSociete(demande: Dem_Soc) {
    return this.http.post<Dem_Soc>(`${this.apiRoot}/DemSoc/addDemSoc`, demande);
  }
  update(demande: Dem_Soc) {
    return this.http.put<Dem_Soc>(`${this.apiRoot}/DemSoc/update/`, demande);
  }
  deleteDemandeSociete(id: Number) {

    return this.http.delete<Dem_Soc>(`${this.apiRoot}/DemSoc/delete/${id}`);
  }
  getAllPresEmissionDemandeSociete() {  
    return this.http.get<Dem_Soc[]>(`${this.apiRoot}/DemSoc/allPresEmmisionDemSocs`);
  }
  
  uploadDoc(formData: FormData,numDemande:any): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.apiRoot}/DemSoc/upload/${numDemande}`, formData , {
      reportProgress: true,
      observe: 'events'
    }); 
  }

  getFilesDoc (numDemande:any) {
    return this.http.get(`${this.apiRoot}/DemSoc/getFiles/${numDemande}`);
  }
  downloadDoc(filename: string,numDemande:any): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiRoot}/DemSoc/download/${numDemande}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }); 
  }
  deleteFileDoc (filename: string,numDemande:any) {
    return this.http.get(`${this.apiRoot}/DemSoc/delete/${numDemande}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
  }
  generateReportConditionGenerale(id:any){
    return this.http.get(`${this.apiRoot}/DemSoc/report/conditionGenerale/${id}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportConditionParticuliere(id:any){
    return this.http.get(`${this.apiRoot}/DemSoc/report/conditionParticuliere/${id}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportSoumission(id:any){
    return this.http.get(`${this.apiRoot}/DemSoc/report/soumission/${id}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  getFilesuri (filename: string,numDemande:any) {
    return this.http.get(`${this.apiRoot}/DemSoc/url/${numDemande}/${filename}`);
  }
  
  downloadInDossier(filename: string,numDemande:any): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiRoot}/DemSoc/downloadI/${numDemande}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }); 
  }

  generateReportInstruction(id:any,demandeur : string,raisonsociale:string,anneerelation:string, soumission : number,avancedemarrage : number,bonneexcution: number,retenuegarantie: number,nomgerant:string, definitive:number ,cmttotale: number,
    soumissionencours : number,avancedemarrageencours: number, bonneexecutionencours : number,retenuegarantieencours : number,definitiveencours : number,cmttotaleencours : number,
    policenumero : string, denomminationsociale : string ,objetavenant : string ,datesoucription: string ,beneficiaire : string){
    return this.http.get(`${this.apiRoot}/DemSoc/report/instruction/${id}/${demandeur}/${raisonsociale}/${anneerelation}/${soumission}/${avancedemarrage}/${bonneexcution}/${retenuegarantie}/${nomgerant}/${definitive}/${cmttotale}/${soumissionencours}/${avancedemarrageencours}/${bonneexecutionencours}/${retenuegarantieencours}/${definitiveencours}/${cmttotaleencours}/${policenumero}/${denomminationsociale}/${objetavenant}/${datesoucription}/${beneficiaire}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  
  generateReportInstruction1(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/instruction/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  
  getAllDemandeSocieteByClient(id : number) {

    return this.http.get<Dem_Soc[]>(`${this.apiRoot}/DemSoc/allDemSocCl/${id}`);
  }
  getAllDemandeSocieteByProspect(id : number) {

    return this.http.get<Dem_Soc[]>(`${this.apiRoot}/DemSoc/allDemSocPr/${id}`);
  }


  generateReportInstructionCredit(id:any){
    return this.http.get(`${this.apiRoot}/DemSoc/report/instructionCredit/${id}`, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportInstructionCredit1(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/instructionCredit/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportInstructionPerte(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/instructionPerte/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActeAd(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/acteAd/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActesoumission(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/acteSoumis/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActedefinitive(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/acteDefinitive/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActeBonneExecution(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/acteBnExecution/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActeRetenueGarantie(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/acteRetenueG/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActeCredit(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/acteCredit/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
  generateReportActeLocassur(id:any, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/DemSoc/report/acteLocassur/${id}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
}
