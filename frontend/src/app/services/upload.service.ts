import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  apiRoot: String;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  upload(formData: FormData,numclient:any): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.apiRoot}/files/upload/${numclient}`, formData , {
      reportProgress: true,
      observe: 'events'
    }); 
  }
  
  uploadInDossier(formData: FormData,numclient:any,dossier:any): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.apiRoot}/files/uploadInDossier/${numclient}/${dossier}`, formData , {
      reportProgress: true,
      observe: 'events'
    }); 
  }

  download(filename: string,numclient:any): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiRoot}/files/download/${numclient}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }); 
  }
  downloadInDossier(filename: string,numclient:any,dossier:any): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiRoot}/files/downloadInDossier/${numclient}/${dossier}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }); 
  }

  getFiles (numclient:any) {
    return this.http.get(`${this.apiRoot}/files/getFiles/${numclient}`);
  }
  getFilesDossier (numclient:any,dossier:any) {
    return this.http.get(`${this.apiRoot}/files/getFilesDossier/${numclient}/${dossier}`);
  }
  
  getFilesAutres (numclient:any) {
    return this.http.get(`${this.apiRoot}/files/getFilesAutres/${numclient}`);
  }

  deleteFile (filename: string,numclient:any) {
    return this.http.get(`${this.apiRoot}/files/delete/${numclient}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
  }
  deleteFileInDossier (filename: string,numclient:any,dossier:any) {
    return this.http.get(`${this.apiRoot}/files/deleteInDossier/${numclient}/${dossier}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
  }

  deplacerFile (filename: string,numclient:any,dossier:any,dossier2:any) {
    return this.http.get(`${this.apiRoot}/files/moveFile/${numclient}/${dossier}/${filename}/${dossier2}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
  }






  //intermediaire

  uploadIntermediaire(formData: FormData,numInter:any): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.apiRoot}/files/uploadInter/${numInter}`, formData , {
      reportProgress: true,
      observe: 'events'
    }); 
  }
  
  getFilesIntermediaire (numInter:any) {
    return this.http.get(`${this.apiRoot}/files/getFilesIntermediaire/${numInter}`);
  }

  downloadInter(filename: string,numInter:any): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiRoot}/files/downloadIntermediaire/${numInter}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }); 
  }
  deleteFileIntermediaire (filename: string,numInter:any) {
    return this.http.get(`${this.apiRoot}/files/deleteIntermediaire/${numInter}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
  }
}
