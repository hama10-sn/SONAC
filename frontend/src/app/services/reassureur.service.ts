import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reassureur } from '../model/Reassureur';

@Injectable({
  providedIn: 'root'
})
export class ReassureurService {

  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }
  /*
  l'API qui nous permet de lister les reassureur
  */
  getAllReassureur() {

    return this.http.get<Reassureur []>(`${this.apiRoot}/reassureur/allReassureur`);
  }
  /*
  l'API qui nous permet d'ajouter un reassureur
  */
  addReassureur(reassureur: any){
    //console.log(reassureur)
    return this.http.post(`${this.apiRoot}/reassureur/addReassureur`,reassureur);
  }
  /*
  l'API qui nous permet de modifier un reassureur
  */
  update(reassureur:any) {
    return this.http.put<Reassureur>(`${this.apiRoot}/reassureur/update`,reassureur);
  }
  /*
  l'API qui nous permet de supprimer un reassureur
  */
  deleteReassureur(id: String) {
    return this.http.delete<Reassureur>(`${this.apiRoot}/reassureur/delete/${id}`);
  }
  generateReportReassureur(format: String, formData: FormData): Observable<HttpEvent<string[]>> {
    return this.http.post<any>(`${this.apiRoot}/reassureur/report/${format}`, formData, {
      
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    });
  }
}
