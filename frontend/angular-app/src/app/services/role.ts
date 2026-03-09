import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = environment.apiUrl + "/Role";

  constructor(private http: HttpClient) {}

  createRole(roleName:string){

    return this.http.post(
      `${this.apiUrl}/CreateRole?RoleName=${roleName}`,
      {}
    );

  }

}