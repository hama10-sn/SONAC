import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Clause } from '../model/Clause';

@Injectable({
  providedIn: 'root'
})
export class ClauseService {

  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllClauses() {

    return this.http.get<Clause[]>(`${this.apiRoot}/clause/allClauses`);
  }
  addClause(cl: Clause) {
    return this.http.post(`${this.apiRoot}/clause/addClause`, cl);
  }
  modifClause(cl: Clause) {
    return this.http.put(`${this.apiRoot}/clause/editClause`, cl);
  }
  dellClause(code: Number) {
    return this.http.get(`${this.apiRoot}/clause/delClause/${code}`);
  } 
  getAllClausesByActe(id: Number) {

    return this.http.get<Clause[]>(`${this.apiRoot}/clause/AllClausesByActe/${id}`);
  }
  getAllClausesNoAffectByActe(id: Number) {

    return this.http.get<Clause[]>(`${this.apiRoot}/clause/AllClausesByActeNoExiste/${id}`);
  }
  getProduitByActe(police:any){
    return this.http.get(`${this.apiRoot}/clause/findProduitByActe/${police}`);
  }
}
