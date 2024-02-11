import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rdv } from '../model/Rdv';
import { Mail } from '../model/Mail'
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RdvService {


  apiRoot: String;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  getRdvByCodeAgent(rdv: String) {

    return this.http.get<Rdv[]>(`${this.apiRoot}/rdv/findByCodeAgent/${rdv}`);
  }

  getRdvByCodeClient(rdv: String) {

    return this.http.get<Rdv[]>(`${this.apiRoot}/rdv/findByCodeClient/${rdv}`);
  }

  getAllRdvs() {

    return this.http.get<Rdv[]>(`${this.apiRoot}/rdv/allRdvs`);
  }
  addRdv(type: Rdv) {

    return this.http.post<Rdv>(`${this.apiRoot}/rdv/addRdv`, type);
  }
  updateRdv(type: Rdv, id: Number) {

    return this.http.put<Rdv>(`${this.apiRoot}/rdv/update/${id}`, type);
  }

  deleteRdv(id: Number) {

    return this.http.delete<Rdv>(`${this.apiRoot}/rdv/delete/${id}`);
  }

  //gestion dossier

  uploadRDV(formData: FormData,numRDV:any): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(`${this.apiRoot}/rdv/uploadRDV/${numRDV}`, formData , {
      reportProgress: true,
      observe: 'events'
    }); 
  }
  
  getFilesRDV (numRDV:any) {
    return this.http.get(`${this.apiRoot}/rdv/getFilesRDV/${numRDV}`);
  }

  downloadRDV(filename: string,numRDV:any): Observable<HttpEvent<Blob>> {
    return this.http.get(`${this.apiRoot}/rdv/downloadRDV/${numRDV}/${filename}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob'
    }); 
  }
  deleteFileRDV (filename: string,numRDV:any) {
    return this.http.get(`${this.apiRoot}/rdv/deleteRDV/${numRDV}/${filename}`, {
      //reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
  }
  onMail_Send(email : Mail,form:FormData) {

    return this.http.post<Mail>(`${this.apiRoot}/rdv/mail/${email}/${form}`,  {
      reportProgress: true,
      observe: 'events',
      responseType: 'text'
    });
}
upload(formData: FormData): Observable<HttpEvent<string[]>> {
  return this.http.post<string[]>(`${this.apiRoot}/rdv/files`, formData , {
    observe: 'events'
    
  }); 
}

sendMail1(formData: FormData,mail:any,objet:any,body:any,infos:any) {
  return this.http.post<string[]>(`${this.apiRoot}/rdv/files/${mail}/${objet}/${body}/${infos}`, formData , {
    observe: 'events'
    
  }); 
}
sendMail2(email:Mail ) {
  return this.http.post<Mail>(`${this.apiRoot}/rdv/mail`, email);
   
  
}
upload2(formData: FormData,mail:any) {
  var requestHeader = { headers: new HttpHeaders({ 'Content-Type': 'text/html', 'No-Auth': 'False' })};
 const headers = new HttpHeaders().set('Content-Type', 'text/html; charset=utf-8');
  return this.http.post<string[]>(`${this.apiRoot}/rdv/file/mail`, formData , {
    headers, responseType: 'text' as 'json',
    observe: 'events'
    
  }); 
}
}