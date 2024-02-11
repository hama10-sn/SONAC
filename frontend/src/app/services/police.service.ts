import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Police } from '../model/Police';
import { PoliceForm } from '../model/PoliceForm';

// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PoliceService {

  apiRoot: string;

  constructor(private httpClient: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }


  getAllPolice(): Observable<Police[]> {
    return this.httpClient.get<Police[]>(`${this.apiRoot}/police/allpolice`);
  }

  addPolice(police: Police): Observable<Police> {
    return this.httpClient.post<Police>(`${this.apiRoot}/police/addpolice`, police, httpOptions);
  }

  updatePolice(police: Police) {
    return this.httpClient.put<Police>(`${this.apiRoot}/police/updatepolice`, police, httpOptions);
  }

  getAllPoliceByClient(id: Number) {

    return this.httpClient.get<Police[]>(`${this.apiRoot}/police/allpoliceByClient/${id}`);
  }

  getAllPoliceByClientAndBranche(id: Number) {

    return this.httpClient.get(`${this.apiRoot}/police/allpoliceByClientAndBranche/${id}`);
  }

  getAllPoliceByClientAndBrancheCaution(id: Number) {

    return this.httpClient.get(`${this.apiRoot}/police/allpoliceByClientAndBrancheCaution/${id}`);
  }

  //   getAllProduitByCategorie(categorie:any){
  //     return this.httpClient.get(`${this.apiRoot}/produit/findByCodeCategorie/${categorie}`);
  //   }
  getAllpoliceClient(numcli: any) {
    return this.httpClient.get<Police[]>(`${this.apiRoot}/police/allpoliceClient/${numcli}`);
  }

  getPolice(numpol: any) {
    return this.httpClient.get(`${this.apiRoot}/police/getPolice/${numpol}`);
  }
  getLastAvenantByPolice(numpol: any) {
    return this.httpClient.get(`${this.apiRoot}/police/getAvenantByPolice/${numpol}`);
  }

  deletePolice(id: Number) {

    return this.httpClient.delete<Police>(`${this.apiRoot}/police/delete/${id}`);
  }

  tarifer(police: Police, acte, typeca, typeSoum, typeRisque, typeAvenant) {
    return this.httpClient.post(`${this.apiRoot}/police/tarifer/${typeca}/${typeSoum}/${typeRisque}/${typeAvenant}`, { police, acte });
  }
  tariferPeriode(police: Police, acte, typeSoum, typeRisque, typeAvenant,periode,tauxPreferentiel) {
    return this.httpClient.post(`${this.apiRoot}/police/tariferPeriodeique/${typeSoum}/${typeRisque}/${typeAvenant}/${periode}/${tauxPreferentiel}`, { police, acte });
  }

  tariferPolice(capital, codeProduit, inter, typeca, typeSoum, typeRisque, typeAvenant, duree) {
    return this.httpClient.get(`${this.apiRoot}/police/tariferPolice/${capital}/${codeProduit}/${inter}/${typeca}/${typeSoum}/${typeRisque}/${typeAvenant}/${duree}`);
  }

  tariferPoliceTauxPref(capital, codeProduit, inter, typeca, typeSoum, typeRisque, typeAvenant, duree, tauxPreferentiel) {
    return this.httpClient.get(`${this.apiRoot}/police/tariferPoliceTauxPref/${capital}/${codeProduit}/${inter}/${typeca}/${typeSoum}/${typeRisque}/${typeAvenant}/${duree}/${tauxPreferentiel}`);
  }

  tariferTarifTrimestrielleTauxPref(police: Police, acte, typeca, typeSoum, typeRisque, typeAvenant, tauxPreferentiel) {
    return this.httpClient.post(`${this.apiRoot}/police/tariferTarifTrimestrielTauxPref/${typeca}/${typeSoum}/${typeRisque}/${typeAvenant}/${tauxPreferentiel}`, { police, acte });
  }

  modifPoliceEcheance2(police, tarif, type, numfact) {


    return this.httpClient.post(`${this.apiRoot}/police/modifPoliceEcheance2/${type}/${numfact}`, { tarif, police });
  }
  modifPoliceTarifTrimestrielle(addForm, police, tarif, type, numfact) {


    return this.httpClient.post(`${this.apiRoot}/police/modifPoliceEcheance2Trimestrielle/${type}/${numfact}`, { tarif, police, addForm });
  }
  modifPoliceCorrectionEngag(police, tarif, acte, type, numfact) {


    return this.httpClient.post(`${this.apiRoot}/police/modifPoliceCorrectionEngag/${type}/${numfact}`, { tarif, police, acte });
  }
  addpoliceForm(police: PoliceForm): Observable<Police> {
    return this.httpClient.post<PoliceForm>(`${this.apiRoot}/police/addpoliceForm`, police, httpOptions);
  }
  ajoutPolice(police) {
    return this.httpClient.post(`${this.apiRoot}/police/ajoutPolice`, police);

  }
  ajoutPolicePropo(propo) {
    return this.httpClient.get(`${this.apiRoot}/police/transformePropos/${propo}`);

  }

  getPoliceAll(numpol: any) {
    return this.httpClient.get<Police[]>(`${this.apiRoot}/police/getPoliceAll/${numpol}`);
  }

  getAllPoliceConsultation() {

    return this.httpClient.get(`${this.apiRoot}/police/allPoliceConsultation`);
  }

  getAllPoliceConsultationByClient(numClient: number) {

    return this.httpClient.get(`${this.apiRoot}/police/allPoliceConsultationByClient/${numClient}`);
  }

  getAllPoliceConsultationByProduit(numProduit: number) {

    return this.httpClient.get(`${this.apiRoot}/police/allPoliceConsultationByProduit/${numProduit}`);
  }

  getAllPoliceConsultationByIntermediaire(numIntermediaire: number) {

    return this.httpClient.get(`${this.apiRoot}/police/allPoliceConsultationByIntermediaire/${numIntermediaire}`);
  }

  getAllPoliceConsultationByClientAndProduit(numClient: number, numProduit: number) {

    return this.httpClient.get(`${this.apiRoot}/police/allPoliceConsultationByClientAndProduit/${numClient}/${numProduit}`);
  }

  getAllPoliceConsultationByClientAndIntermediaire(numClient: number, numInterm: number) {

    return this.httpClient.get(`${this.apiRoot}/police/allPoliceConsultationByClientAndIntermediaire/${numClient}/${numInterm}`);
  }

  getAllPoliceConsultationByProduitAndIntermediaire(numProduit: number, numInterm: number) {

    return this.httpClient.get(`${this.apiRoot}/police/allPoliceConsultationByProduitAndIntermediaire/${numProduit}/${numInterm}`);
  }

  getAllPoliceConsultationByAllCriteres(numClient: number, numProduit: number, numInterm: number) {

    return this.httpClient.get(`${this.apiRoot}/police/allPoliceConsultationByAllCriteres/${numClient}/${numProduit}/${numInterm}`);
  }

  generateReportPolice(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.httpClient.post<any>(`${this.apiRoot}/police/report/${format}`, formData, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  generateReportAllPorteFeuillePolice(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.httpClient.post<any>(`${this.apiRoot}/police/report/allportefeuille/${format}`, formData, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }



ajoutProposition(propos) {
  return this.httpClient.post(`${this.apiRoot}/police/ajoutProposition`, propos);


}
getAllProposition() {
  return this.httpClient.get<PoliceForm[]>(`${this.apiRoot}/police/allProposition`);
}




 delProposition(id: Number) {
  return this.httpClient.delete(`${this.apiRoot}/police/deleteProposition/${id}`);
}


ajoutAcheteur(numpol,form) {
  return this.httpClient.post(`${this.apiRoot}/police/ajoutAcheteurPolice/${numpol}`, form);

}
ajoutAcheteurNewCapi(numpol,capiAssur,numFact,form) {
  return this.httpClient.post(`${this.apiRoot}/police/ajoutAcheteurPolice/${numpol}/${capiAssur}/${numFact}`, form);

}
getAllpoliceClientCred(numcli: any) {
  return this.httpClient.get<Police[]>(`${this.apiRoot}/police/allpoliceClientCred/${numcli}`);
}

getAllpoliceClientCMT(numcli: any) {
  return this.httpClient.get<Police[]>(`${this.apiRoot}/police/allpoliceClientCMT/${numcli}`);
}

getAllpoliceClientAutre(numcli: any) {
  return this.httpClient.get<Police[]>(`${this.apiRoot}/police/allpoliceClientAutre/${numcli}`);
}

}
