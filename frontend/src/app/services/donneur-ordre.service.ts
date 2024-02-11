import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DonneurOrdre } from '../model/DonneurOrdre';

@Injectable({
  providedIn: 'root'
})
export class DonneurOrdreService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllDonneurOrdres() {

    return this.http.get<DonneurOrdre[]>(`${this.apiRoot}/donneurOrdre/allDonneurOrdres`);
  }
  addDonneurOrdre(donneurOrdre: DonneurOrdre) {
    return this.http.post(`${this.apiRoot}/donneurOrdre/addDonneurOrdre`, donneurOrdre);
  }
  modifDonneurOrdre(donneurOrdre: DonneurOrdre) {
    return this.http.put(`${this.apiRoot}/donneurOrdre/editDonneurOrdre`, donneurOrdre);
  }
}
