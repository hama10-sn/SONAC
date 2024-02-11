import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Encaissement } from '../model/Encaissement';
import { Garantie } from '../model/Garantie';

@Injectable({
  providedIn: 'root'
})
export class EncaissementService {
  apiRoot: String;
  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }


  getAllEncaissement() {

    return this.http.get<Encaissement[]>(`${this.apiRoot}/encaissement/allEncaissements`);
  }
  getAllEncaissementFact(numfact) {

    return this.http.get<Encaissement[]>(`${this.apiRoot}/encaissement/GetEncaissements/${numfact}`);
  }

  getEncaissementNum(numEnc) {

    return this.http.get<Encaissement[]>(`${this.apiRoot}/encaissement/getEncaissement/${numEnc}`);
  }

  /* annulerEncaiss(numEncaiss) {

    return this.http.post(`${this.apiRoot}/encaissement/annulerEncaissement`, numEncaiss);
  } */

  annulerEncaiss(numEncaiss, typeAnnulation) {

    return this.http.post(`${this.apiRoot}/encaissement/annulerEncaissement/${typeAnnulation}`, numEncaiss);
  }

  payerCommission(form: any) {
    return this.http.post(`${this.apiRoot}/encaissement/payerCommission`, form);
  }
  GetCommission(form: any) {
    return this.http.post(`${this.apiRoot}/encaissement/GetCommissions`, form);
  }
  addEncaissement(encaissement: Encaissement) {
    return this.http.post(`${this.apiRoot}/encaissement/addEncaissement`, encaissement);
  }

  saveEncaissementAvoir(encaissement: Encaissement) {
    return this.http.post(`${this.apiRoot}/encaissement/addEncaissementAvoir`, encaissement);
  }

  addEncaissementMultiple(encaissements, montantCheque) {
    return this.http.post(`${this.apiRoot}/encaissement/addEncaissementMultiple/${montantCheque}`, encaissements);
  }
  modifEncaissement(encaissement: Encaissement) {
    return this.http.put(`${this.apiRoot}/encaissement/editEncaissement`, encaissement);
  }

  // Les méthodes suivantes servent éssentiellement à faire la consultation et édition des encaissements
  getAllEncaissementsAndClient() {

    return this.http.get(`${this.apiRoot}/encaissement/allEncaissementsandClient`);
  }

  getAllEncaissementByClient(numclient: number) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsByClient/${numclient}`);
  }

  getAllEncaissementByPeriode(date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsByPeriode/${date_debut}/${date_fin}`);
  }

  getAllEncaissementByProduit(numProd: number) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsByProduit/${numProd}`);
  }

  getAllEncaissementByIntermediaire(numInterm: number) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsByIntermediaire/${numInterm}`);
  }

  getAllEncaissementByPeriodeAndProduit(numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsByPeriodeAndProduit/${numProd}/${date_debut}/${date_fin}`);
  }

  getAllEncaissementByPeriodeAndIntermediaire(numInterm: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsByPeriodeAndIntermediaire/${numInterm}/${date_debut}/${date_fin}`);
  }

  getAllEncaissementByProduitAndIntermediaire(numInterm: number, numProd: number) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsByProduitAndIntermediaire/${numInterm}/${numProd}`);
  }

  getAllEncaissementByCriteres(numInterm: number, numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsByCriteres/${numInterm}/${numProd}/${date_debut}/${date_fin}`);
  }

  generateReportEncaissement(format: String, title: String, demandeur: string, numInterm: number, numProd: number, dateDebut: string, dateFin: string) {
    return this.http.get(`${this.apiRoot}/encaissement/report/${format}/${title}/${demandeur}/${numInterm}/${numProd}/${dateDebut}/${dateFin}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  // Les méthodes suivantes servent éssentiellement à faire la consultation et édition des 
  // encaissements annulés (productions annulés)
  getAllEncaissementsAnnules() {

    return this.http.get(`${this.apiRoot}/encaissement/allEncaissementsAnnules`);
  }

  getAllEncaissementsAnnulesByPeriode(date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsAnnulesByPeriode/${date_debut}/${date_fin}`);
  }

  getAllEncaissementsAnnulesByProduit(numProd: number) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsAnnulesByProduit/${numProd}`);
  }

  getAllEncaissementsAnnulesByIntermediaire(numInterm: number) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsAnnulesByIntermediaire/${numInterm}`);
  }

  getAllEncaissementsAnnulesByPeriodeAndProduit(numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsAnnulesByPeriodeAndProduit/${numProd}/${date_debut}/${date_fin}`);
  }

  getAllEncaissementsAnnulesByPeriodeAndIntermediaire(numInterm: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsAnnulesByPeriodeAndIntermediaire/${numInterm}/${date_debut}/${date_fin}`);
  }

  getAllEncaissementsAnnulesByProduitAndIntermediaire(numInterm: number, numProd: number) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsAnnulesByProduitAndIntermediaire/${numInterm}/${numProd}`);
  }

  getAllEncaissementsAnnulesByCriteres(numInterm: number, numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/encaissement/encaissementsAnnulesByCriteres/${numInterm}/${numProd}/${date_debut}/${date_fin}`);
  }

  getJournalProductionJournalier() {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalier`);
  }

  getJournalProductionParJour(jour: string) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionParJour/${jour}`);
  }

  getJournalProductionJournalierByPolice(jour: string, num_poli: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByPolice/${jour}/${num_poli}`);
  }

  getJournalProductionJournalierByClient(jour: string, num_clien: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByClient/${jour}/${num_clien}`);
  }

  getJournalProductionJournalierByBranche(jour: string, num_branche: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByBranche/${jour}/${num_branche}`);
  }

  getJournalProductionJournalierByProduit(jour: string, num_produit: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByProduit/${jour}/${num_produit}`);
  }

  getJournalProductionJournalierByIntermediaire(jour: string, num_intermediaire: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByIntermediaire/${jour}/${num_intermediaire}`);
  }

  getJournalProductionJournalierByPoliceAndClient(jour: string, num_poli: number, num_clien: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByPoliceAndClient/${jour}/${num_poli}/${num_clien}`);
  }

  getJournalProductionJournalierByPoliceAndBranche(jour: string, num_poli: number, num_branche: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByPoliceAndBranche/${jour}/${num_poli}/${num_branche}`);
  }

  getJournalProductionJournalierByPoliceAndProduit(jour: string, num_poli: number, num_produit: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByPoliceAndProduit/${jour}/${num_poli}/${num_produit}`);
  }

  getJournalProductionJournalierByPoliceAndIntermediaire(jour: string, num_poli: number, num_intermediaire: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByPoliceAndIntermediaire/${jour}/${num_poli}/${num_intermediaire}`);
  }

  getJournalProductionJournalierByClientAndBranche(jour: string, num_clien: number, num_branche: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByClientAndBranche/${jour}/${num_clien}/${num_branche}`);
  }

  getJournalProductionJournalierByClientAndProduit(jour: string, num_clien: number, num_produit: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByClientAndProduit/${jour}/${num_clien}/${num_produit}`);
  }

  getJournalProductionJournalierByClientAndIntermediaire(jour: string, num_clien: number, num_intermediaire: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByClientAndIntermediaire/${jour}/${num_clien}/${num_intermediaire}`);
  }

  getJournalProductionJournalierByProduitAndIntermediaire(jour: string, num_produit: number, num_intermediaire: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByProduitAndIntermediaire/${jour}/${num_produit}/${num_intermediaire}`);
  }

  getJournalProductionJournalierByPoliceAndClientAndBranche(jour: string, num_poli: number, num_clien: number, num_branche: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByPoliceAndClientAndBranche/${jour}/${num_poli}/${num_clien}/${num_branche}`);
  }

  getJournalProductionJournalierByPoliceAndClientAndBrancheAndProduit(jour: string, num_poli: number, num_clien: number, num_branche: number, num_produit: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByPoliceAndClientAndBrancheAndProduit/${jour}/${num_poli}/${num_clien}/${num_branche}/${num_produit}`);
  }

  getJournalProductionJournalierByPoliceAndClientAndBrancheAndProduitAndIntermediaire(jour: string, num_poli: number, num_clien: number, num_branche: number, num_produit: number, num_intermediaire: number) {
    return this.http.get(`${this.apiRoot}/encaissement/journalProductionJournalierByPoliceAndClientAndBrancheAndProduitAndIntermediaire/${jour}/${num_poli}/${num_clien}/${num_branche}/${num_produit}/${num_intermediaire}`);
  }

  generateReportEncaissementsAnnules(format: String, title: String, demandeur: string, numInterm: number, numProd: number, dateDebut: string, dateFin: string) {
    return this.http.get(`${this.apiRoot}/encaissement/report/encaissementsAnnules/${format}/${title}/${demandeur}/${numInterm}/${numProd}/${dateDebut}/${dateFin}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  downloadRecuFactureSimple(encai_numeroencaissement: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/encaissement/recuFactureSimple/${encai_numeroencaissement}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  downloadRecuEncaissementAnnuler(encai_numeroencaissement: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/encaissement/recuEncaissementAnnuler/${encai_numeroencaissement}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  downloadRecuFactureMultiple(encai_numeroencaissement: Number, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/encaissement/recuFactureMultiple/${encai_numeroencaissement}`, formData, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateReportProductionJournalier(format: String, title: String, demandeur: string, jour: string, num_poli: number, num_clien: number, num_branche: number, num_produit: number, num_intermediaire: number) {
    return this.http.get(`${this.apiRoot}/encaissement/report/${format}/${title}/${demandeur}/${jour}/${num_poli}/${num_clien}/${num_branche}/${num_produit}/${num_intermediaire}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
}
