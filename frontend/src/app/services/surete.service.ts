import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cimacodificationcompagnie } from '../model/Cimacodificationcompagnie';
import { Client } from '../model/Client';
import { Surete } from '../model/Surete';

@Injectable({
  providedIn: 'root'
})

export class SureteService {
    apiRoot: String;
    constructor(private http: HttpClient) { 
      this.apiRoot = environment.apiUrl;
    }
  
    
  getAllSurete() {

    return this.http.get<any>(`${this.apiRoot}/surete/allSurete`);
  }

  addSurete(surete: Surete) {
    return this.http.post<any>(`${this.apiRoot}/surete/addSurete`, surete);
  }

  modifSurete(surete: Surete) {
    return this.http.put<any>(`${this.apiRoot}/surete/updateSurete`, surete);
  }

  libererSurete(surete: Surete) {
    return this.http.put<any>(`${this.apiRoot}/surete/libererSurete`, surete);
  }

  deleteSurete(num: Number) {
    return this.http.get<any>(`${this.apiRoot}/surete/deleteSurete/${num}`);
  }
}