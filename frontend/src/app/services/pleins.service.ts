import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Banque } from '../model/Banque';
import { Pleins } from '../model/Pleins';

@Injectable({
    providedIn: 'root'
})
export class PleinsService {

    apiRoot: string;

    constructor(private httpClient: HttpClient) {
        this.apiRoot = environment.apiUrl;
    }

    getAllPleins() {
        return this.httpClient.get(`${this.apiRoot}/pleins/findAllPleins`);
    }

    addPleins(pleins: Pleins) {
        return this.httpClient.post(`${this.apiRoot}/pleins/addPleins`, pleins);
    }

    updatePleins(pleins: Pleins) {
        return this.httpClient.put(`${this.apiRoot}/pleins/updatePleins`, pleins);
    }
}
