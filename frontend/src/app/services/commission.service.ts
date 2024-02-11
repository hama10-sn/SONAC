import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Commission } from '../model/Commission';

// Pour dire à angular que les données retournées sont de type JSON
const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
} ; 

@Injectable({
  providedIn: 'root'
})
export class CommissionService {

    apiRoot: string ;

  constructor(private httpClient: HttpClient) { 
      this.apiRoot = environment.apiUrl ;
  }

  
getAllCommissions(): Observable<Commission[]> {
    return this.httpClient.get<Commission[]>(`${this.apiRoot}/commission/allcommission`) ;
}

addCommission(commission: Commission): Observable<Commission> {
    return this.httpClient.post<Commission>(`${this.apiRoot}/commission/addcommission`, commission, httpOptions);
}

updateCommission(id: number, commission: Commission) {
    return this.httpClient.put<Commission>(`${this.apiRoot}/commission/updateCommission/${id}`, commission, httpOptions) ;
}

lastID(numproduit:any, codeapporteur: any){
    return this.httpClient.get(`${this.apiRoot}/commission/lastID/${numproduit}/${codeapporteur}`);
  }
// lastID(numcategorie:any, codeapporteur:any, codegarantie:any){
//     return this.httpClient.get(`${this.apiRoot}/commission/lastID/${numcategorie}/${codeapporteur}/${codegarantie}`);
//   }
  

}
