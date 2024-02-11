import { HttpClient, HttpEvent, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Prospect } from "../model/Prospect";


// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProspectService {

  apiRoot: string;

  constructor(private httpClient: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  getAllProspect(): Observable<Prospect[]> {
    return this.httpClient.get<Prospect[]>(`${this.apiRoot}/prospect/allProspects`);
  }

  addProspect(prospect: Prospect): Observable<Prospect> {
    return this.httpClient.post<Prospect>(`${this.apiRoot}/prospect/addProspect`, prospect, httpOptions);
  }

  updateProspect(prospect: Prospect) {
    return this.httpClient.put<Prospect>(`${this.apiRoot}/prospect/editProspect`, prospect, httpOptions);
  }

  getAllProspectPhysique() {

    return this.httpClient.get<Prospect[]>(`${this.apiRoot}/prospect/allProspectPhysique`);
  }

  getAllProspectMorale() {

    return this.httpClient.get<Prospect[]>(`${this.apiRoot}/prospect/allProspectMorale`);
  }

  delProspect(num: number) {
    return this.httpClient.get(`${this.apiRoot}/prospect/deleteProspect/${num}`);
  }

  verifDeleteProspectPhysique(num: Number) {
    return this.httpClient.get(`${this.apiRoot}/prospect/verifDeleteProspectPhysique/${num}`);
  }

  verifDeleteProspectMorale(num: Number) {
    return this.httpClient.get(`${this.apiRoot}/prospect/verifDeleteProspectMorale/${num}`);
  }



  //gestion dossier

  uploadDoc(formData: FormData, numProspect: any): Observable<HttpEvent<string[]>> {
    return this.httpClient.post<string[]>(`${this.apiRoot}/prospect/upload/${numProspect}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getFilesDoc(numProspect: any) {
    return this.httpClient.get(`${this.apiRoot}/prospect/getFiles/${numProspect}`);
  }

  downloadDoc(filename: string, numProspect: any): Observable<HttpEvent<Blob>> {
    return this.httpClient.get(`${this.apiRoot}/prospect/download/${numProspect}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    });
  }
  deleteFileDoc(filename: string, numProspect: any) {
    return this.httpClient.get(`${this.apiRoot}/prospect/delete/${numProspect}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
  }


  getProspectByNinea(ninea: String) {

    return this.httpClient.get(`${this.apiRoot}/prospect/findbyNinea/${ninea}`);
  }

  getProspectByRC(codeRC: String) {
    return this.httpClient.get(`${this.apiRoot}/prospect/findbyRC/${codeRC}`);

  }

  getAllProspectAttente(): Observable<Prospect[]> {
    return this.httpClient.get<Prospect[]>(`${this.apiRoot}/prospect/allProspectsAttente`);
  }

  transformerProspect(numero: number) {
    return this.httpClient.put<any>(`${this.apiRoot}/prospect/transformeProspect/${numero}`, httpOptions);
  }

  getAllProspectsTransformes(): Observable<Prospect[]> {
    return this.httpClient.get<Prospect[]>(`${this.apiRoot}/prospect/allProspectsTransformes`);
  }

  getProspectByNumero(numero: Number): Observable<any> {
    return this.httpClient.get<Prospect>(`${this.apiRoot}/prospect/findprospectbynumero/${numero}`);
  }

  getAllProspectNonTransformesApartirDuMois(date_debut: any): Observable<any> {
    return this.httpClient.get<any>(`${this.apiRoot}/prospect/allProspectNonTransformesApartirDuMois/${date_debut}`);
  }

  getAllProspectNonTransformesParPeriode(date_debut: any, date_fin: any): Observable<any> {
    return this.httpClient.get<any>(`${this.apiRoot}/prospect/allProspectNonTransformesParPeriode/${date_debut}/${date_fin}`);
  }

  getAllProspectNonTransformesDepuisXMois(nbreMois: any): Observable<any> {
    return this.httpClient.get<any>(`${this.apiRoot}/prospect/allProspectNonTransformesDepuisXMois/${nbreMois}`);
  }

  generateReportProspect(format: String, title: String, demandeur: string, dateDebut: string, dateFin: string, periodeNombreMois: number) {
    return this.httpClient.get(`${this.apiRoot}/prospect/report/prospectNonTranformes/${format}/${title}/${demandeur}/${dateDebut}/${dateFin}/${periodeNombreMois}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
}
