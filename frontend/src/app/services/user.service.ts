import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/User';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiRoot: String;

  constructor(private http: HttpClient) { 
    this.apiRoot = environment.apiUrl;
  }

  getUser(login: String) {

    return this.http.get<User>(`${this.apiRoot}/utilisateur/findbylogin/${login}`);
  }

  getAllUsers() {

    return this.http.get<User[]>(`${this.apiRoot}/utilisateur/allUsers`);
  }

  getAllByDirection(direction : String) {

    return this.http.get<User[]>(`${this.apiRoot}/utilisateur/allUsersByDirection/${direction}`);
  }

  addUser(user: any) {
    return this.http.post<any>(`${this.apiRoot}/utilisateur/addUser`, user);
  }
  modifUser(user: any) {
    return this.http.post<any>(`${this.apiRoot}/utilisateur/updateUser`, user);
  }
  delUser(login: string) {
    return this.http.delete(`${this.apiRoot}/utilisateur/deleteuser/${login}`);
  }
  changePassword(login: String,passold: String,passnew: String) {

    return this.http.get<User>(`${this.apiRoot}/utilisateur/updatePassword/login=${login}&passwordOld=${passold}&passwordnew=${passnew}`);
  }
  updatePhoto(image , login , id){
    const form = new FormData();
    form.append('image', image);
    form.append('login', login);
    form.append('id', id);
    return this.http.post(`${this.apiRoot}/utilisateur/updatePhoto`, form);
  }
  getPhoto(login,id): Observable<Blob>{
    return this.http.get(`${this.apiRoot}/utilisateur/getPhoto/login=${login}&id=${id}`, { responseType: 'blob' });
  }

  sendMailForPWD(mail: any) {
    const form = new FormData();
    form.append('email', mail);
    return this.http.post<any>(`${this.apiRoot}/utilisateur/forgot-password`, form);
  }

  resetPWD(password: any, token: any) {
    const form = new FormData();
    form.append('password', password);
    form.append('token', token);
    return this.http.put<any>(`${this.apiRoot}/utilisateur/reset-password`, form);
  }
}
