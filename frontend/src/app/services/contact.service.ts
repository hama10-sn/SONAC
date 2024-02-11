import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Contact } from '../model/Contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
 
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  getAllContactes() {

    return this.http.get<Contact[]>(`${this.apiRoot}/contact/allContact`);
  }
  addContacte(contact: Contact) {
    return this.http.post<Contact>(`${this.apiRoot}/contact/addContact`, contact);
  }
  update(contact: Contact) {
    return this.http.put<Contact>(`${this.apiRoot}/contact/update`, contact);
  }
  deleteContact(id: Number) {

    return this.http.delete<Contact>(`${this.apiRoot}/contact/delete/${id}`);
  }
  allContactByClient(id:number) {

    return this.http.get<any>(`${this.apiRoot}/contact/allContactByClient/${id}`);
  }   
  deleteContactClient(id: Number, client:number,leader: boolean) {

    return this.http.delete<Contact>(`${this.apiRoot}/contact/supprimer/${id}/${client}/${leader}`);
  }
  allMandataireByClient(id:number) {

    return this.http.get<any>(`${this.apiRoot}/contact/allMandataireByClient/${id}`);
  }
  
  getAllMandataires() {

    return this.http.get<Contact[]>(`${this.apiRoot}/contact/allMandataire`);
  }
  getNombreLeader(client:any) {

    return this.http.get<Contact[]>(`${this.apiRoot}/contact/nbContactByClient/${client}`);
  }

}
