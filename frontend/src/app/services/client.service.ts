import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cimacodificationcompagnie } from '../model/Cimacodificationcompagnie';
import { Client } from '../model/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
    apiRoot: String;
    constructor(private http: HttpClient) {
      this.apiRoot = environment.apiUrl;
    }


  getAllClients() {

    return this.http.get<Client[]>(`${this.apiRoot}/client/allclients`);
  }

  getAllClientsAttente() {

    return this.http.get<Client[]>(`${this.apiRoot}/client/allclientsattente`);
  }

  getAllClientPhysique() {

    return this.http.get<Client[]>(`${this.apiRoot}/client/allclientPhysique`);
  }
  getAllClientMorale() {

    return this.http.get<Client[]>(`${this.apiRoot}/client/allclientMorale`);
  }
  addClient(client: Client) {
    return this.http.post<any>(`${this.apiRoot}/client/addClient`, client);
  }
  modifClient(client: Client) {
    return this.http.put<any>(`${this.apiRoot}/client/editClient`, client);
  }

  modifClientReprise(client: Client) {
    return this.http.put<any>(`${this.apiRoot}/client/modifClientReprise`, client);
  }
  modifClientById(id,ca,cs) {
    return this.http.get(`${this.apiRoot}/client/updateClient/${id}/${ca}/${cs}`);
  }
  // deleteClient(id: Number) {

  //   return this.http.delete<Client>(`${this.apiRoot}/client/delete/${id}`);
  // }

  getClient(numCli: any) {

    return this.http.get<Client>(`${this.apiRoot}/client/getClient/${numCli}`);
  }

  getClientByNumero(numClient: any) {

    return this.http.get(`${this.apiRoot}/client/getClientByNumero/${numClient}`);
  }

  // Méthodes de vérification de la suppression et de la suppressionn effective

  deleteClient(num: Number) {
    return this.http.get(`${this.apiRoot}/client/deleteClient/${num}`);
  }

  verifDeleteClient(num: Number) {
    return this.http.get(`${this.apiRoot}/client/verifDeleteClient/${num}`);
  }


  // generateReportClient(format: String, title: String, demandeur: string){
  //   return this.http.get(`${this.apiRoot}/client/report/${format}/${title}/${demandeur}`, {

  //     reportProgress: true,
  //     observe: 'events',
  //     responseType: 'blob' as 'json'
  //   });
  // }

  generateReportClient(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/client/report/${format}`, formData, {

      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

  // uploadRDV(formData: FormData,numRDV:any): Observable<HttpEvent<string[]>> {
  //   return this.http.post<string[]>(`${this.apiRoot}/rdv/uploadRDV/${numRDV}`, formData , {
  //     reportProgress: true,
  //     observe: 'events'
  //   });
  // }


  getClientByPolice(police:any){
    return this.http.get(`${this.apiRoot}/client/findClientByPolice/${police}`);
  }

  getClientByNinea(ninea:String){
    return this.http.get(`${this.apiRoot}/client/findbyNinea/${ninea}`);
  }

  getClientByRC(rc:String){
    return this.http.get(`${this.apiRoot}/client/findbyRC/${rc}`);
  }

  getClientByProspect(numero: Number): Observable<any> {
    return this.http.get<any>(`${this.apiRoot}/client/findclientbyprospect/${numero}`);
  }
}

