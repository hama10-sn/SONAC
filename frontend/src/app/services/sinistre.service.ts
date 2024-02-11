import { HttpClient, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { RecoursFront } from "../model/RecoursFront";
import { Sinistre } from "../model/Sinistre";
import { SinistreFront } from "../model/SinistreFront";

@Injectable({
  providedIn: 'root'
})

export class sinistreService {

  apiRoot: string;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  getAllSinistreMouvement() {
    return this.http.get(`${this.apiRoot}/sinistre/findallSinistre`);
  }

  getAllMenaceSinistreMouvement() {
    return this.http.get(`${this.apiRoot}/sinistre/findallMenaceSinistre`);
  }

  getAllRecoursSinistre() {
    return this.http.get(`${this.apiRoot}/sinistre/listeRecoursSinistre`);
  }

  getSinistreByNumero(sini_num: any) {
    return this.http.get(`${this.apiRoot}/sinistre/findSinistreByNumero/${sini_num}`);
  }

  ajouterMenaceSinistre(sinistreFront) {
    return this.http.post(`${this.apiRoot}/sinistre/ajouterMenace`, sinistreFront);
  }

  ajouterDeclarationSinistre(sinistreFront) {
    return this.http.post(`${this.apiRoot}/sinistre/ajouterSinistre`, sinistreFront);
  }

  modificationMenaceSinistre(sinistreFront) {
    return this.http.post(`${this.apiRoot}/sinistre/modifierMenaceSinistre`, sinistreFront);
  }

  // Méthode à revoir si elle est utilisée
  modifierMenaceSinistre(sinistre: Sinistre) {
    return this.http.put<any>(`${this.apiRoot}/sinistre/modifier`, sinistre);
  }

  getMoratoireByNumeroCheque(num_cheque: any) {
    return this.http.get(`${this.apiRoot}/moratoire/findByNumCheque/${num_cheque}`);
  }

  getPenaliteByNumeroCheque(num_cheque: any) {
    return this.http.get(`${this.apiRoot}/penalite/findByNumCheque/${num_cheque}`);
  }

  getMenaceSinistreByAcheteur(acheteur: Number) {
    return this.http.get<any>(`${this.apiRoot}/sinistre/findMenaceSinistreByAcheteur/${acheteur}`);
  }

  getSinistreByAcheteur(acheteur: Number) {
    return this.http.get<any>(`${this.apiRoot}/sinistre/findSinistreByAcheteur/${acheteur}`);
  }

  // generateEditionFicheMenaceSinistre1(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
  //   return this.http.post<any>(`${this.apiRoot}/sinistre/editerFicheMenaceSinistre/${format}`, formData, {

  //     reportProgress: true,
  //     observe: 'events',
  //     responseType: 'blob' as 'json'
  //   });
  // }

  generateEditionFicheMenaceSinistre(typeDeclaration: String, demandeur: String, document: String, sinistreFront: SinistreFront): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/sinistre/editerFicheMenaceSinistre/${typeDeclaration}/${demandeur}/${document}`, sinistreFront, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateEditionFicheModificationEvaluation(demandeur: String, document: String, sinistreFront: SinistreFront): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/sinistre/editerFicheModificationEvaluation/${demandeur}/${document}`, sinistreFront, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateEditionFicheModificationSAP(demandeur: String, document: String, sinistreFront: SinistreFront): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/sinistre/editerFicheModificationSAP/${demandeur}/${document}`, sinistreFront, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  getAllSinistres() {
    return this.http.get(`${this.apiRoot}/sinistre/listeAllSinistre`);
  }

  getSinistreByBranche(branche: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreParBranche/${branche}`);
  }

  getSinistreByProduit(produit: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreParProduit/${produit}`);
  }

  getSinistreByPeriode(debut: any, fin: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreParPeriode/${debut}/${fin}`);
  }

  getSinistreByClient(client: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreParClient/${client}`);
  }

  getSinistreByPolice(police: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreParPolice/${police}`);
  }

  getSinistreByBrancheAndProduit(branche: any, produit: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreParBrancheAndProduit/${branche}/${produit}`);
  }

  getSinistreByBrancheAndProduitAndPeriode(branche: any, produit: any, debut: string, fin: string) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreParBrancheAndProduitAndPeriode/${branche}/${produit}/${debut}/${fin}`);
  }

  getSinistreByBrancheAndProduitAndPeriodeAndClient(branche: any, produit: any, debut: string, fin: string, client: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreParBrancheAndProduitAndPeriodeAndClient/${branche}/${produit}/${debut}/${fin}/${client}`);
  }

  getSinistreByBrancheAndProduitAndPeriodeAndClientAndPolice(branche: any, produit: any, debut: string, fin: string, client: any, police: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreParBrancheAndProduitAndPeriodeAndClientAndPolice/${branche}/${produit}/${debut}/${fin}/${client}/${police}`);
  }

  generateReportSinistre(format: String, title: String, demandeur: string, numBranche: number, numProd: number, debut: string, fin: string, numClient: number, numPolice: number) {
    return this.http.get(`${this.apiRoot}/sinistre/report/${format}/${title}/${demandeur}/${numBranche}/${numProd}/${debut}/${fin}/${numClient}/${numPolice}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  leveeMenaceSinistre(formData: FormData) {
    return this.http.put(`${this.apiRoot}/sinistre/leveeMenaceSinistre`, formData);
  }

  confirmeMenaceSinistre(formData: FormData) {
    return this.http.post(`${this.apiRoot}/sinistre/confirmeMenaceSinistre`, formData);
  }

  modificationEvaluationSinistre(sinistreFront) {
    return this.http.post(`${this.apiRoot}/sinistre/modificationEvaluation`, sinistreFront);
  }

  modificationSAPSinistre(sinistreFront) {
    return this.http.post(`${this.apiRoot}/sinistre/modificationSAP`, sinistreFront);
  }

  getAllSinistralite() {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistralite`);
  }

  getSinistraliteByBranche(branche: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistraliteParBranche/${branche}`);
  }

  getSinistraliteByPeriode(debut: any, fin: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistraliteParPeriode/${debut}/${fin}`);
  }

  getSinistraliteByClient(client: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistraliteParClient/${client}`);
  }

  getSinistraliteByPolice(police: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistraliteParPolice/${police}`);
  }

  getSinistraliteByBrancheAndPeriode(branche: any, debut: string, fin: string) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistraliteParBrancheAndPeriode/${branche}/${debut}/${fin}`);
  }

  getSinistraliteByBrancheAndPeriodeAndClient(branche: any, debut: string, fin: string, client: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistraliteParBrancheAndPeriode/${branche}/${debut}/${fin}/${client}`);
  }

  getSinistraliteByBrancheAndPeriodeAndClientAndPolice(branche: any, debut: string, fin: string, client: any, police: any) {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistraliteParBrancheAndPeriode/${branche}/${debut}/${fin}/${client}/${police}`);
  }

  getDetailsSinistraliteByBranche(branche: any) {
    return this.http.get(`${this.apiRoot}/sinistre/detailSinistraliteParBranche/${branche}`);
  }

  generateReportSinistralite(format: String, title: String, demandeur: string, numBranche: number, debut: string, fin: string, numClient: number, numPolice: number) {
    return this.http.get(`${this.apiRoot}/sinistre/report/${format}/${title}/${demandeur}/${numBranche}/${debut}/${fin}/${numClient}/${numPolice}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  getAllSinistreACloturer() {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreACloturer`);
  }

  clotureSinistre(sini_id, recoursForm) {
    return this.http.post(`${this.apiRoot}/sinistre/clotureSinistre/${sini_id}`, recoursForm);
  }

  getAllSinistreClotures() {
    return this.http.get(`${this.apiRoot}/sinistre/listeSinistreClotures`);
  }

  reOuvertureSinistre(sini_id, recoursForm) {
    return this.http.post(`${this.apiRoot}/sinistre/reOuvrirSinistre/${sini_id}`, recoursForm);
  }

  ajouterMoratoire(sini_id, moratoireForm) {
    return this.http.post(`${this.apiRoot}/moratoire/ajouterMoratoire/${sini_id}`, moratoireForm);
  }

  getMoratoireBySinistre(sini_id) {
    return this.http.get(`${this.apiRoot}/moratoire/findMoratoireBySinistre/${sini_id}`);
  }

  modifierMoratoire(morato_id, moratoire) {
    return this.http.put(`${this.apiRoot}/moratoire/modifierMoratoire/${morato_id}`, moratoire);
  }

  annulerMoratoire(sini_id, moratoireForm) {
    return this.http.post(`${this.apiRoot}/moratoire/annulerMoratoire/${sini_id}`, moratoireForm);
  }

  ajouterPenalite(sini_id, penaliteForm) {
    return this.http.post(`${this.apiRoot}/penalite/ajouterPenalite/${sini_id}`, penaliteForm);
  }

  getPenaliteByMoratoire(morato_id) {
    return this.http.get(`${this.apiRoot}/penalite/findPenaliteParMoratoire/${morato_id}`);
  }

  encaisserPenalite(sini_id, penaliteForm) {
    return this.http.post(`${this.apiRoot}/penalite/encaisserPenalite/${sini_id}`, penaliteForm);
  }

  encaisserMoratoire(sini_id, moratoireForm) {
    return this.http.post(`${this.apiRoot}/moratoire/encaisserMoratoire/${sini_id}`, moratoireForm);
  }

  generateFicheClotureSinistre(demandeur: string, recoursFront: RecoursFront): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/sinistre/fichierClotureSinistre/${demandeur}`, recoursFront, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateFicheReouvertureSinistre(demandeur: string, recoursFront: RecoursFront): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/sinistre/fichierReouvertureSinistre/${demandeur}`, recoursFront, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  getAllAnnulation() {
    return this.http.get(`${this.apiRoot}/sinistre/consultationAnnulation`);
  }

  getAnnulationByPeriode(debut: any, fin: any) {
    return this.http.get(`${this.apiRoot}/sinistre/consultationAnnulationPeriodique/${debut}/${fin}`);
  }

  getAnnulationByProduit(sini_produit) {
    return this.http.get(`${this.apiRoot}/sinistre/consultationAnnulationParProduit/${sini_produit}`);
  }

  getAnnulationByBranche(sini_branche) {
    return this.http.get(`${this.apiRoot}/sinistre/consultationAnnulationParBranche/${sini_branche}`);
  }

  getAnnulationByPeriodeAndProduit(debut: any, fin: any, sini_produit) {
    return this.http.get(`${this.apiRoot}/sinistre/consultationAnnulationParPeriodeAndProduit/${debut}/${fin}/${sini_produit}`);
  }

  getAnnulationByPeriodeAndProduitAndBranche(debut: any, fin: any, sini_produit, sini_branche) {
    return this.http.get(`${this.apiRoot}/sinistre/consultationAnnulationParPeriodeAndProduitAndBranche/${debut}/${fin}/${sini_produit}/${sini_branche}`);
  }

  generateReportAnnulation(format: String, title: String, demandeur: string, debut: string, fin: string) {
    return this.http.get(`${this.apiRoot}/sinistre/report/${format}/${title}/${demandeur}/${debut}/${fin}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

}
