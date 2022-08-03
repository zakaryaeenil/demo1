import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../Models/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {HelperForm} from "../Models/helper-form";

const API_USERS_URL = `${environment.apiUrl}`;
const API_HELPER_URL = "http://localhost:8080/";
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  //ALL Clients
  getClients(token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,

    });
    return this.http.get<any>(API_HELPER_URL+`users/search/findByRoles_Id?id=3`,{ headers : httpHeaders});
  }

  //ALL Clients
  getAgents(token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,

    });
    return this.http.get<any>(API_HELPER_URL+`users/search/findByRoles_Id?id=2`,{ headers : httpHeaders});
  }

  ClientCreateFolder(dossier : HelperForm , files : File[] , token : string) {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const formData = new FormData();
    const json = JSON.stringify(dossier);
    const blob = new Blob([json], {
      type: 'application/json'
    });

    formData.append("form", blob);
    for (let i of files) {

      formData.append("document",i);

    }

    console.log(formData.get("form"));
    return this.http.post(API_USERS_URL+`/dossier/save`,formData , {responseType : 'text' , headers : httpHeaders });

  }

  //Delete Client
  deleteClient(id: number , token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(API_HELPER_URL+`users/${id}`,{responseType: 'text' , headers : httpHeaders});
  }
}
