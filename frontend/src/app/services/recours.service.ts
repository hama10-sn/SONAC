import { HttpClient, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { RecoursFront } from "../model/RecoursFront";
import { ValidationFront } from "../model/ValidationFront";

@Injectable({
  providedIn: 'root'
})
export class RecoursService {
  apiRoot: string;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  ajouterPropositionRecours(sini_id, recoursForm) {
    return this.http.post(`${this.apiRoot}/recours/ajoutRecours/${sini_id}`, recoursForm);
  }

  annulerPropositionRecours(sini_id, recoursForm) {
    return this.http.post(`${this.apiRoot}/recours/annulationProposition/${sini_id}`, recoursForm)
  }

  validationRecours(sini_id, validationForm) {
    return this.http.post(`${this.apiRoot}/recours/validationRecours/${sini_id}`, validationForm)
  }

  annulationValidationRecours(sini_id, validationForm) {
    return this.http.post(`${this.apiRoot}/recours/annulationValidationRecours/${sini_id}`, validationForm)
  }

  validationRecoursEncaisse(sini_id, validationForm) {
    return this.http.post(`${this.apiRoot}/recours/validationRecoursEncaisse/${sini_id}`, validationForm)
  }

  annulationValidationRecoursEncaisse(sini_id, validationForm) {
    return this.http.post(`${this.apiRoot}/recours/annulationValidationRecoursEncaisse/${sini_id}`, validationForm)
  }

  listeMouvementParSinistreAndTypeMouvement(mvts_numsinistre, mvts_typemvt) {
    return this.http.get(`${this.apiRoot}/mvtsinistre/getMvtsinistreByTypeMvtsAndSinistre/${mvts_numsinistre}/${mvts_typemvt}`);
  }

  getRecoursByNumeroCheque(num_cheque: any) {
    return this.http.get(`${this.apiRoot}/recours/findByNumCheque/${num_cheque}`);
  }

  listeMouvementTypeMouvement() {
    return this.http.get(`${this.apiRoot}/mvtsinistre/getMvtsinistreByTypeMvts`);
  }

  listeMoratoires() {
    return this.http.get(`${this.apiRoot}/mvtsinistre/getMoratoireEncaisse`);
  }

  generateEditionFichePropositionRecours(sini_id: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/recours/editerFichierPropositionRecours/${sini_id}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateEditionFicheRecoursEncaisse(mvts_num: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/recours/editerFichierRecoursEncaisse/${mvts_num}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateFichePropositionRecours(demandeur: string, recoursFront: RecoursFront): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/recours/fichierPropositionRecours/${demandeur}`, recoursFront, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateFicheRecoursEncaisse(demandeur: string, validationFront: ValidationFront): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/recours/fichierRecoursEncaisse/${demandeur}`, validationFront, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  downloadRecuEncaissementRecours(sini_id: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/recours/recuEncaissementRecours/${sini_id}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  downloadRecuEncaissementMoratoire(sini_id: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/moratoire/recuEncaissementMoratoire/${sini_id}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  downloadRecuEncaissementPenalite(sini_id: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/penalite/recuEncaissementPenalite/${sini_id}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
}
