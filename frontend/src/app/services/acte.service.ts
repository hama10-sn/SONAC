import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Acte } from '../model/Acte';

@Injectable({
  providedIn: 'root'
})
export class ActeService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  

  getAllActes() {

    return this.http.get<Acte[]>(`${this.apiRoot}/acte/allActes`);
  }
  getActePolice(numpol) {

    return this.http.get(`${this.apiRoot}/acte/getActePolice/${numpol}`);
  }
  addActe(acte: Acte) {
    return this.http.post(`${this.apiRoot}/acte/addActe`, acte);
  }
  modifActe(acte: Acte) {
    return this.http.put(`${this.apiRoot}/acte/editActe`, acte);
  }
  dellActe(code: Number) {
    return this.http.get(`${this.apiRoot}/acte/dellActe/${code}`);
  }

  lastID(police:any){
    return this.http.get(`${this.apiRoot}/acte/lastID/${police}`);
  }
  deleteActe(id: Number) {
    return this.http.delete<Acte>(`${this.apiRoot}/acte/delete/${id}`);

  }
  getAllActeByPolice(act:any) {

    return this.http.get<Acte[]>(`${this.apiRoot}/acte/findActeByNumero/${act}`);
  }
}
