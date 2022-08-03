import { Dossier } from "./dossier";
import {User} from "./user";


export class DossierPro {
  id : number;
  name : string
  endAt : Date
  createdAt : Date;
  user : User;
  dossiers : Dossier[]
}
