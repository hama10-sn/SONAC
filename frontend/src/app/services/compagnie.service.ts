import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compagnie } from '../model/Compagnie';
import { environment } from '../../environments/environment';
import { Cimacodificationcompagnie } from '../model/Cimacodificationcompagnie';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompagnieService {
    apiRoot: String;

    constructor(private http: HttpClient) { 
      this.apiRoot = environment.apiUrl;
    }
  
    getAllCompagniesDelete() {

      return this.http.get<Compagnie[]>(`${this.apiRoot}/compagnie/allCompagniesDelete`);
    }
  getAllCompagnies() {

    return this.http.get<Compagnie[]>(`${this.apiRoot}/compagnie/allCompagnies`);
  }
  addCompagnie(compagnie: Compagnie) {
    return this.http.post<any>(`${this.apiRoot}/compagnie/addCompagnie`, compagnie);
  }
  modifCompagnie(compagnie: Compagnie) {
    return this.http.put<Compagnie>(`${this.apiRoot}/compagnie/editCompagnie`, compagnie);
  }
  // deleteCompagnie(id: Number) {

  //   return this.http.delete<Compagnie>(`${this.apiRoot}/compagnie/delete/${id}`);
  // }
      
  getAllCodecimacompagnies() {

    return this.http.get<Cimacodificationcompagnie[]>(`${this.apiRoot}/compagnie/allCodecimacompagnie`);
  }

  // Méthodes de vérification de la suppression et de la suppressionn effective

  deleteCompagnie(num: String) {
    return this.http.get(`${this.apiRoot}/compagnie/deleteCompagnie/${num}`);
  }

  verifDeleteCompagnie(num: String) {
    return this.http.get(`${this.apiRoot}/compagnie/verifDeleteCompagnie/${num}`);
  }
  generateReportCompagnie(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/compagnie/report/${format}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }

}
