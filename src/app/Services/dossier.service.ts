import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Dossier} from "../Models/dossier";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../Models/user";



const API_DOSSIERS_URL = `${environment.apiUrl}`;
const API_HELPER_URL = "http://localhost:8080/";
@Injectable({
  providedIn: 'root'
})
export class DossierService {

  constructor(private http : HttpClient) { }

  //All Dossier
  getAllDossiers(token : string) : Observable<Dossier[]>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Dossier[]>(API_DOSSIERS_URL+`/dossier/all`, {
      headers: httpHeaders,
    });

  }

  //Import Dossier for Admin
  getDossiersImport(token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(API_HELPER_URL+`dossiers/search/findByTypeDossier?TypeDossier=Import`, {
      headers: httpHeaders,
    });
  }

  //Export Dossier for Admin
  getDossiersExport(token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(API_HELPER_URL+`dossiers/search/findByTypeDossier?TypeDossier=Export`, {
      headers: httpHeaders,
    });
  }

  //Completed Dossier for Admin
  getDossiersCompleted(token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(API_HELPER_URL+`dossiers/search/findByAvailable?available=3`, {
      headers: httpHeaders,
    });
  }

  //En traitement Dossier
  getDossiersEntraitement(token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(API_HELPER_URL+`dossiers/search/findByAvailable?available=2`, {
      headers: httpHeaders,
    });
  }

  //En attente Dossier
  getDossiersEnAttente(token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(API_HELPER_URL+`dossiers/search/findByAvailable?available=1`);
  }

  // Get Free folders I
  getFreeFolders(token : string) : Observable<Dossier[]>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Dossier[]>(API_DOSSIERS_URL+`/employee/freefolders`, {
      headers: httpHeaders,
    });
  }

  // Get Folder By loggedIn Client
  getLoggedInClientFolders(token : string ,type : string) : Observable<Dossier[]>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Dossier[]>(API_DOSSIERS_URL+`/client/myfolders/${type}`, {
      headers: httpHeaders,
    } );
  }

  // Get Folder By loggedIn Client
  getLoggedInEmployeeFolders(token : string , type : string) : Observable<Dossier[]>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Dossier[]>(API_DOSSIERS_URL+`/employee/myfolders/${type}` , {
      headers: httpHeaders,
    });
  }


  //Delete Dossier
  DeleteDossier(id: number , token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(API_DOSSIERS_URL+`/dossier/${id}`,{responseType: 'text' , headers : httpHeaders});
  }

  getDocuments(id : number , token : string) : Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(API_HELPER_URL+`dossiers/${id}/documents` , {headers : httpHeaders})
  }
  DownloadDocument(id : number , token : string) :Observable<Blob> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Blob>(API_DOSSIERS_URL+`/documents/${id}/downloadDB`,{ responseType: 'blob' as 'json'  , headers  : httpHeaders});
  }
}
