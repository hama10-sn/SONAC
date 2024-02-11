import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role } from '../model/Role';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {


  apiRoot: String;

  constructor(private http: HttpClient) {
    this.apiRoot = environment.apiUrl;
  }

  getRoleByName(role: String) {

    return this.http.get<Role>(`${this.apiRoot}/profil/findByNom/${role}`);
  }

  getAllRoles() {

    return this.http.get<Role[]>(`${this.apiRoot}/profil/allProfils`);
  }
  addRole(role: Role) {

    return this.http.post<Role>(`${this.apiRoot}/profil/addProfil`, role);
  }
  updateRoles(role: Role, id: Number) {

    return this.http.put<Role>(`${this.apiRoot}/profil/update/${id}`, role);
  }

  deleteRole(id: Number) {

    return this.http.delete<Role>(`${this.apiRoot}/profil/delete/${id}`);
  }

}
