import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../Services/user.service";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../auth";
import {Observable} from "rxjs";
import {User} from "../../../Models/user";
import {Role} from "../../../Models/role";
import {HelperForm} from "../../../Models/helper-form";
import {Helperformfile} from "../../../Models/helperformfile";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dossier-create',
  templateUrl: './dossier-create.component.html',
  styleUrls: ['./dossier-create.component.scss']
})
export class DossierCreateComponent implements OnInit {
  public selectedFiles : File[] = [];
  public forms : Helperformfile[] = [];
  public helperform = new HelperForm();

  c : string = ''
  typeDossier : string = ''

  private helper = ''
  user$: Observable<User>;
  protected roles : Role[];
  public users : User[];
  public isClient : boolean = true;
  public isLoading : boolean = false;
  public type_operation : string = 'Normale';
  normale : boolean = true;
  urgent : boolean = false;
  tr : boolean = false;
  public i : number =0;
  public type : string = '';
  public typehelper : string = '';

  constructor(private service : UserService , private userservice : UserService , private toastr : ToastrService ,private auth: AuthService , private router : Router) {
    this.helper = this.auth.gettoken();
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.subscribe(
      res => {
        this.roles = res.roles
        if(res.roles && res.roles.map(r => r.name != 'USER')) {
          this.getClient()
          this.isClient = false
        }
      }
    )
  }

  ngOnInit(): void {
  }

  getClient(){
    this.userservice.getClients(this.helper).subscribe(data =>{
      this.users = data._embedded.users;
      this.isLoading = true;
    })
  }

  selectedfile( event : any , index : number){
    this.forms.map(m => {
      if (m.index == index){
        let ext =  event.target.files[0].name.split('.').pop();
        m.file = new File([event.target.files[0]], m.name+'.'+ext );
      }
    })

  }
  onFileSelected() {
    this.helperform.typeDossier=this.typeDossier;
    this.helperform.operation=this.type_operation;
    if (this.isClient){
      this.helperform.username="";
    }

    else {
      if (this.c){
        this.helperform.username=this.c;
      }
      else{
        this.toastr.error("Client must be not  null  !!", "Repeat please", {
          timeOut: 3000,
        })
        return null
      }

    }


    if (this.forms) {
      this.forms.map(m =>{
        this.selectedFiles.push(m.file)
      })
      if (this.selectedFiles){
        this.service.ClientCreateFolder( this.helperform,this.selectedFiles , this.helper).subscribe(
          data =>{
            this.toastr.success("Folder Sended successfully !!", "Good Job", {
              timeOut: 3000,
            })
            this.router.navigateByUrl('dossiers/lists');
          },
          error=>{
            this.toastr.error('Check The Inputs ','Failure to send Folder')
          }
        );
      }
    }
  }
  // Validations

  addrow(){
    let form : Helperformfile = new Helperformfile()
    form.index = this.forms.length
    this.forms.push(form)
  }
  deleterow(index  : number){
    this.forms = this.forms.filter(m => {  return m.index !== index;})
  }
  isNormale(){
    this.normale = true;
    this.urgent = false;
    this.tr = false;
    this.type_operation = 'Normale'
    console.log(this.type_operation , 'normal')
  }
  isUrgent(){
    this.normale = false;
    this.tr = false;
    this.urgent = true;
    this.type_operation = 'Urgent'
    console.log(this.type_operation , 'urgent')
  }
  isTr(){
    this.normale = false;
    this.urgent = false;
    this.tr = true;
    this.type_operation = 'TR'
    console.log(this.type_operation , 'tr')
  }
}
