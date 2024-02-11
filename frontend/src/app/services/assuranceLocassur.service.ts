import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AssuranceLocassur } from '../model/AssuranceLocassur';

@Injectable({
  providedIn: 'root'
})
export class AssuranceLocassurService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllAssuranceLocassurs() {

    return this.http.get<AssuranceLocassur[]>(`${this.apiRoot}/assuranceLocassur/allAssuranceLocassurs`);
  }
  addAssuranceLocassur(assuranceLocassur: AssuranceLocassur) {
    return this.http.post(`${this.apiRoot}/assuranceLocassur/addAssuranceLocassur`, assuranceLocassur);
  }
  // modifAssuranceLocassur(assuranceLocassur: AssuranceLocassur) {
  //   return this.http.put(`${this.apiRoot}/assuranceLocassur/editAssuranceLocassur`, assuranceLocassur);
  // }

  deleteAssuranceLocassur(id: Number) {

    return this.http.delete<AssuranceLocassur>(`${this.apiRoot}/assuranceLocassur/delete/${id}`);
  }

}
