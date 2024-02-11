import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MainLeve } from '../model/MainLeve';

@Injectable({
  providedIn: 'root'
})
export class MainLeveService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllMainLeves() {

    return this.http.get<MainLeve[]>(`${this.apiRoot}/mainleve/allMainleve`);
  }
  addMainLeve(mainLeve: MainLeve) {
    return this.http.post(`${this.apiRoot}/mainleve/addMainleve`, mainLeve);
  }
  modifMainLeve(mainLeve: MainLeve) {
    return this.http.put(`${this.apiRoot}/mainleve/editMainLeve`, mainLeve);
  }
  
  allMainLeveByEngagement(id:number) {

    return this.http.get<any>(`${this.apiRoot}/mainleve/allMainLeveByEngagement/${id}`);
  }   
}
