import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Filiale_Client } from '../model/Filiale_Client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
// tslint:disable-next-line:class-name
export class Filiale_ClientService {


  apiRoot: String;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  getFiliale_ClientByCodeUser(filiale_Client: String) {

    return this.http.get<Filiale_Client>(`${this.apiRoot}/filiale_Client/findByCodeUser/${filiale_Client}`);
  }

  getAllFiliale_Clients() {

    return this.http.get<Filiale_Client[]>(`${this.apiRoot}/filiale_Client/allFiliale_Clients`);
  }
  addFiliale_Client(type: Filiale_Client) {

    return this.http.post<Filiale_Client>(`${this.apiRoot}/filiale_Client/addFiliale_Client`, type);
  }
  updateFiliale_Client(type: Filiale_Client, id: Number) {

    return this.http.put<Filiale_Client>(`${this.apiRoot}/filiale_Client/update/${id}`, type);
  }

  deleteFiliale_Client(id: Number) {

    return this.http.delete<Filiale_Client>(`${this.apiRoot}/filiale_Client/delete/${id}`);
  }

}
