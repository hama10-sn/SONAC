import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ClauseActe } from '../model/ClauseActe';

@Injectable({
  providedIn: 'root'
})
export class ClauseacteService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllClauseActes() {

    return this.http.get<ClauseActe[]>(`${this.apiRoot}/clauseActe/allClauseActes`);
  }
  addClauseActe(cl) {
    return this.http.post(`${this.apiRoot}/clauseActe/addClauseActe`, cl);
  }
  modifClauseActe(cl: ClauseActe) {
    return this.http.put(`${this.apiRoot}/clauseActe/editClauseActe`, cl);
  }
  getClauseActeByActe(numacte) {

    return this.http.get(`${this.apiRoot}/clauseActe/getClauseActeByActe/${numacte}`);
  }
}
