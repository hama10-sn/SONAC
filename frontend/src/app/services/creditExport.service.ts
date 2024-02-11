import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreditExport } from '../model/CreditExport';

@Injectable({
  providedIn: 'root'
})
export class CreditExportService {
  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }


  getAllCreditExports() {

    return this.http.get<CreditExport[]>(`${this.apiRoot}/creditExport/allCreditExports`);
  }
  addCreditExport(creditExport: CreditExport) {
    return this.http.post(`${this.apiRoot}/creditExport/addCreditExport`, creditExport);
  }
  // modifCreditExport(creditExport: CreditExport) {
  //   return this.http.put(`${this.apiRoot}/creditExport/editCreditExport`, creditExport);
  // }

  deleteCreditExport(id: Number) {

    return this.http.delete<CreditExport>(`${this.apiRoot}/creditExport/delete/${id}`);
  }

}
