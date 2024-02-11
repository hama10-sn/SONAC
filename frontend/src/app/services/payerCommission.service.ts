import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class PayerCommissionService {

    apiRoot: string ;

  constructor(private httpClient: HttpClient) { 
      this.apiRoot = environment.apiUrl ;
  }

  
  getAllPayerCommission(infoCom) {
    return this.httpClient.post(`${this.apiRoot}/payerCommission/allPayerCommissions`, infoCom);
}

PayerCommission(infoCom,cheque) {
    return this.httpClient.post(`${this.apiRoot}/payerCommission/PayerCommissions`, {infoCom,cheque});
}

}
