import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { RefEncaissement } from "../model/RefEncaissement";

@Injectable({
    providedIn: 'root'
})
export class RefEncaissementService {
    apiRoot: string;

    constructor(private http: HttpClient) {
        this.apiRoot = environment.apiUrl;
    }

    saveRefEncaissement(refEncaissement: RefEncaissement) {
        return this.http.post(`${this.apiRoot}/refEncaissement/addRefEncaissement`, refEncaissement);
    }

    updateRefEncaissement(refEncaissement: RefEncaissement) {
        return this.http.put(`${this.apiRoot}/refEncaissement/updateRefEncaissement`, refEncaissement);
    }

    getRefEncaissementByNumeroTitre(numeroTitre: String) {
        return this.http.get(`${this.apiRoot}/refEncaissement/findRefEncaissementByNumeroTitre/${numeroTitre}`);
    }
}
