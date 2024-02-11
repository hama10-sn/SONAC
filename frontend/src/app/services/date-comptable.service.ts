import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class DateComptableService {
    apiRoot: string;

    constructor(private http: HttpClient) {
        this.apiRoot = environment.apiUrl;
    }

    getAllDateComptable() {
        return this.http.get(`${this.apiRoot}/datecomptable/listeDateComptable`);
    }

    addDateComptable(datecomptable) {
        return this.http.post(`${this.apiRoot}/datecomptable/ajoutDateComptable`, datecomptable);
    }

    updateDateComptable(datecomptable  ) {
        return this.http.put(`${this.apiRoot}/datecomptable/updateDateComptable`, datecomptable);
    }
    updateDelete(id  ) {
        return this.http.delete(`${this.apiRoot}/datecomptable/delete/${id}`);
    }
}