import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Banque } from '../model/Banque';

// Pour dire à angular que les données retournées sont de type JSON
// const httpOptions = {
//     headers: new HttpHeaders({'Content-Type': 'application/json'})
// } ;

@Injectable({
    providedIn: 'root'
})
export class BanqueService {

    apiRoot: string;

    constructor(private httpClient: HttpClient) {
        this.apiRoot = environment.apiUrl;
    }

    getAllBanques() {
        return this.httpClient.get(`${this.apiRoot}/banque/findAllBanque`);
    }

    findBanqueByCode(code: Number) {
        return this.httpClient.get(`${this.apiRoot}/banque/findBanqueByCode/${code}`);
    }

    addBanque(banque: Banque) {
        return this.httpClient.post(`${this.apiRoot}/banque/addBanque`, banque);
    }

    updateBanque(banque: Banque) {
        return this.httpClient.put(`${this.apiRoot}/banque/updateBanque`, banque);
    }

    //   deleteBanque(numero: Number) {

    //     return this.httpClient.delete(`${this.apiRoot}/banque/deleteaBanque/${numero}`);
    //   }
}
