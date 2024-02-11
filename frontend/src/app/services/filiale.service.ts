import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Filiale } from '../model/Filiale';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilialeService {


  apiRoot: String;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  getFilialeByCodeUser(filiale: String) {

    return this.http.get<Filiale>(`${this.apiRoot}/filiale/findByCodeUser/${filiale}`);
  }

  getAllFiliales() {

    return this.http.get<Filiale[]>(`${this.apiRoot}/filiale/allFiliales`);
  }
//join
getAllFilialesComp() {

  return this.http.get<any[]>(`${this.apiRoot}/filiale/allFilialesComp`);
}

  addFiliale(type: Filiale) {

    return this.http.post<Filiale>(`${this.apiRoot}/filiale/addFiliale`, type);
  }
  updateFiliale(type: Filiale, id: Number) {

    return this.http.put<Filiale>(`${this.apiRoot}/filiale/update/${id}`, type);
  }

  deleteFiliale(id: Number) {

    return this.http.delete<Filiale>(`${this.apiRoot}/filiale/delete/${id}`);
  }

}
