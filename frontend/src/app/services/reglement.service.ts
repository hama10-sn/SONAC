import { HttpClient, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Sinistre } from "../model/Sinistre";
import { SinistreFront } from "../model/SinistreFront";

@Injectable({
  providedIn: 'root'
})

export class ReglementService {

  apiRoot: string;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  propositionReglementSinistre(reglementFront) {
    return this.http.post(`${this.apiRoot}/sinistre/reglement/propositionReglement`, reglementFront);
  }

  validationPropositionReglementSinistre(reglementFront) {
    return this.http.post(`${this.apiRoot}/sinistre/reglement/validationReglement`, reglementFront);
  }

  annulationPropositionReglementSinistre(reglementFront) {
    return this.http.post(`${this.apiRoot}/sinistre/reglement/annulationPropositionReglement`, reglementFront);
  }

  annulationReglementValideSinistre(reglementFront) {
    return this.http.post(`${this.apiRoot}/sinistre/reglement/annulationReglementValide`, reglementFront);
  }

  // generateEditionFichePropositionReglement(demandeur: string, sini_id: Number): Observable<HttpEvent<string[]>> {
  //   return this.http.post<any>(`${this.apiRoot}/sinistre/reglement/editerFichePropositionReglement/${demandeur}/${sini_id}`, {
  //     reportProgress: true,
  //     observe: 'events',
  //     responseType: 'blob' as 'json'
  //   });
  // }

  generateEditionFichePropositionReglement(sini_num: Number, mvts_num: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/sinistre/reglement/editerFichePropositionReglement/${sini_num}/${mvts_num}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateEditionFicheValidationReglement(sini_num: Number, mvts_num: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/sinistre/reglement/editerFicheValidationReglement/${sini_num}/${mvts_num}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateEditionFicheReglementFinancier(sini_num: Number, mvts_num: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/sinistre/reglement/editerFicheReglementFinancier/${sini_num}/${mvts_num}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  getAllMvtsReglementsValides() {
    return this.http.get(`${this.apiRoot}/sinistre/reglement/findAllMvtReglementValide`);
  }

  reglementFinancierSinistre(reglementFront) {
    return this.http.post(`${this.apiRoot}/sinistre/reglement/reglementFinancier`, reglementFront);
  }

  getAllReglementFinancier() {
    return this.http.get(`${this.apiRoot}/sinistre/reglement/findAllReglementFinancier`);
  }

  downloadAvisReglementSinistre(sini_id: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/reglement/avisReglement/${sini_id}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  getReglementByNumCheque(numCheque: String) {
    return this.http.get(`${this.apiRoot}/sinistre/reglement/findByNumCheque/${numCheque}`);
  }
}
