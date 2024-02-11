import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ClassificationSecteur } from '../model/ClassificationSecteur';

@Injectable({
  providedIn: 'root'
})
export class ClassificationSecteurService {

  apiRoot: String;
  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }

  getAllGroupes() {

    return this.http.get<ClassificationSecteur[]>(`${this.apiRoot}/classificationSecteur/allClassifications`);
  }

  getAllClassificationSecteur() {

    return this.http.get<ClassificationSecteur[]>(`${this.apiRoot}/classificationSecteur/allClassifications`);
  }

  getLibelleByCodeClassification(code: number) {
    return this.http.get<ClassificationSecteur>(`${this.apiRoot}/classificationSecteur/findLibelleByCode/${code}`);
  }
}
