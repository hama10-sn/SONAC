import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Garantie } from '../model/Garantie';
import { Quittance } from '../model/Quittance';

@Injectable({
  providedIn: 'root'
})
export class QuittanceService {
  apiRoot: String;
  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }


  getAllQuittance() {

    return this.http.get<Quittance[]>(`${this.apiRoot}/quittance/allQuittances`);
  }
  getAllQuittanceClient(numcli) {

    return this.http.get<Quittance[]>(`${this.apiRoot}/quittance/allQuittancesClient/${numcli}`);
  }

  /* findQuittanceByNumFactEncaissement(numFactEncaissement) {

    return this.http.get(`${this.apiRoot}/quittance/findQuittanceByNumFactEncaissement/${numFactEncaissement}`);
  } */

  addQuittance(quittance: Quittance) {
    return this.http.post(`${this.apiRoot}/quittance/addQuittance`, quittance);
  }
  modifQuittance(quittance: Quittance) {
    return this.http.put(`${this.apiRoot}/quittance/editQuittance`, quittance);
  }
  getQuittanceFact(numFact) {

    return this.http.get(`${this.apiRoot}/quittance/getQuittanceFact/${numFact}`);
  }
  getQuittance(numQuit) {

    return this.http.get(`${this.apiRoot}/quittance/getQuittance/${numQuit}`);
  }

  // Les méthodes suivantes servent essentiellement à faire la consultation et l'édition des
  // quittances non payés = emissions
  getAllEmissionConsulation() {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionConsultation`);
  }

  getAllEmissionConsultationByPeriode(date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionConsultationByPeriode/${date_debut}/${date_fin}`);
  }

  getAllEmissionConsultationByProduit(numProd: number) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionConsultationByProduit/${numProd}`);
  }

  getAllEmissionConsultationByIntermediaire(numInterm: number) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionConsultationByIntermediaire/${numInterm}`);
  }

  getAllEmissionConsultationByPeriodeAndProduit(numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionConsultationByPeriodeAndProduit/${numProd}/${date_debut}/${date_fin}`);
  }

  getAllEmissionConsultationByPeriodeAndIntermediaire(numInterm: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionConsultationByPeriodeAndIntermediaire/${numInterm}/${date_debut}/${date_fin}`);
  }

  getAllEmissionConsultationByProduitAndIntermediaire(numInterm: number, numProd: number) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionConsultationByProduitAndIntermediaire/${numInterm}/${numProd}`);
  }

  getAllEmissionConsultationByAllCriteres(numInterm: number, numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionConsultationByCriteres/${numInterm}/${numProd}/${date_debut}/${date_fin}`);
  }

  generateReportEmissions(format: String, title: String, demandeur: string, numInterm: number, numProd: number, dateDebut: string, dateFin: string) {
    return this.http.get(`${this.apiRoot}/quittance/report/${format}/${title}/${demandeur}/${numInterm}/${numProd}/${dateDebut}/${dateFin}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }


  // Les méthodes suivantes servent essentiellement à faire la consultation et l'édition des
  // émissions annulées
  getAllEmissionsAnnuleesConsulation() {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionAnnuleesConsultation`);
  }

  getAllEmissionsAnnuleesConsultationByPeriode(date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionAnnuleesConsultationByPeriode/${date_debut}/${date_fin}`);
  }

  getAllEmissionsAnnuleesConsultationByProduit(numProd: number) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionAnnuleesConsultationByProduit/${numProd}`);
  }

  getAllEmissionsAnnuleesConsultationByIntermediaire(numInterm: number) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionAnnuleesConsultationByIntermediaire/${numInterm}`);
  }

  getAllEmissionsAnnuleesConsultationByPeriodeAndProduit(numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionAnnuleesConsultationByPeriodeAndProduit/${numProd}/${date_debut}/${date_fin}`);
  }

  getAllEmissionsAnnuleesConsultationByPeriodeAndIntermediaire(numInterm: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionAnnuleesConsultationByPeriodeAndIntermediaire/${numInterm}/${date_debut}/${date_fin}`);
  }

  getAllEmissionsAnnuleesConsultationByProduitAndIntermediaire(numInterm: number, numProd: number) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionAnnuleesConsultationByProduitAndIntermediaire/${numInterm}/${numProd}`);
  }

  getAllEmissionsAnnuleesConsultationByAllCriteres(numInterm: number, numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allEmissionAnnuleesConsultationByCriteres/${numInterm}/${numProd}/${date_debut}/${date_fin}`);
  }

  generateReportEmissionsAnnulees(format: String, title: String, demandeur: string, numInterm: number, numProd: number, dateDebut: string, dateFin: string) {
    return this.http.get(`${this.apiRoot}/quittance/reportEmissionsAnnulees/${format}/${title}/${demandeur}/${numInterm}/${numProd}/${dateDebut}/${dateFin}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  // Les méthodes suivantes servent essentiellement à faire la consultation et l'édition des
  // productions
  getAllProductionsConsulation() {

    return this.http.get(`${this.apiRoot}/quittance/allProductionConsultation`);
  }

  getAllProductionsConsulationByPeriode(date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allProductionConsultationByPeriode/${date_debut}/${date_fin}`);
  }

  getAllProductionsConsulationByProduit(numProd: number) {

    return this.http.get(`${this.apiRoot}/quittance/allProductionConsultationByProduit/${numProd}`);
  }

  getAllProductionsConsulationByIntermediaire(numInterm: number) {

    return this.http.get(`${this.apiRoot}/quittance/allProductionConsultationByIntermediaire/${numInterm}`);
  }

  getAllProductionsConsulationByPeriodeAndProduit(numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allProductionConsultationByPeriodeAndProduit/${numProd}/${date_debut}/${date_fin}`);
  }

  getAllProductionsConsulationByPeriodeAndIntermediaire(numInterm: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allProductionConsultationByPeriodeAndIntermediaire/${numInterm}/${date_debut}/${date_fin}`);
  }

  getAllProductionsConsulationByProduitAndIntermediaire(numInterm: number, numProd: number) {

    return this.http.get(`${this.apiRoot}/quittance/allProductionConsultationByProduitAndIntermediaire/${numInterm}/${numProd}`);
  }

  getAllProductionsConsulationByAllCriteres(numInterm: number, numProd: number, date_debut: string, date_fin: string) {

    return this.http.get(`${this.apiRoot}/quittance/allProductionConsultationByCriteres/${numInterm}/${numProd}/${date_debut}/${date_fin}`);
  }

  generateReportProductions(format: String, title: String, demandeur: string, numInterm: number, numProd: number, dateDebut: string, dateFin: string) {
    return this.http.get(`${this.apiRoot}/quittance/report/production/${format}/${title}/${demandeur}/${numInterm}/${numProd}/${dateDebut}/${dateFin}`, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  //add quittance pour police

  addQuittanceForPolice(quittance: Quittance) {
    return this.http.post(`${this.apiRoot}/quittance/addQuittanceForPolice`, quittance);
  }

  getQuittanceByNuymPolice(numpolice) {

    return this.http.get<Quittance>(`${this.apiRoot}/quittance/getQuittanceP/${numpolice}`);
  }

  findQuittanceByPolice(numpolice: any) {

    return this.http.get(`${this.apiRoot}/quittance/findQuittanceByPolice/${numpolice}`);
  }

}
