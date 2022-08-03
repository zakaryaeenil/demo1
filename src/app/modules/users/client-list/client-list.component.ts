import {Component, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../Services/user.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {
  CellClickedEvent,
  CheckboxSelectionCallbackParams,
  ColDef,
  GridReadyEvent,
  HeaderCheckboxSelectionCallbackParams
} from "ag-grid-community";
import {Dossier} from "../../../Models/dossier";
import {AgGridAngular} from "ag-grid-angular";
import {User} from "../../../Models/user";
import {AuthService} from "../../auth";
import {Observable, of} from "rxjs";
import {Role} from "../../../Models/role";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ClientButtonRenderComponent} from "../rendersUsers/client-button-render.component";

const filterParams = {
  comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split('/');
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  },
  browserDatePicker: true,
};
const checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  // we put checkbox on the name if we are not doing grouping
  return params.columnApi.getRowGroupColumns().length === 0;
};
const headerCheckboxSelection = function (params: HeaderCheckboxSelectionCallbackParams) {
  // we put checkbox on the name if we are not doing grouping
  return params.columnApi.getRowGroupColumns().length === 0;
};

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

  user$: Observable<User>;
  private roles : Role[];
  // Each Column Definition results in one Column.
  public columnDefs: ColDef[] = [
    {headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter',
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection,},
    {headerName: 'Name', field: 'username'},
    {headerName: 'Email', field: 'email'},
    {headerName: 'Count Dossiers', field: 'countDossiers',filter: 'agNumberColumnFilter'},
    {headerName: 'First Name', field: 'firstName'},
    {headerName: 'Last Name', field: 'lastName'},
   {headerName: 'Is Enabled', field: 'enabled'},
    {headerName: 'Created', field: 'createdAt' ,filter: 'agDateColumnFilter', filterParams: filterParams},
    {
      headerName: 'Actions',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onBtnClick1.bind(this)
      },
      minWidth : 200
    }
  ];

  public frameworkComponents: any;
  public autoGroupColumnDef: ColDef = {
    headerName: 'Group',
    minWidth: 170,
    field: 'id',
    valueGetter: (params) => {
      if (params.node!.group) {
        return params.node!.key;
      } else {
        return params.data[params.colDef.field!];
      }
    },
    headerCheckboxSelection: true,
    // headerCheckboxSelectionFilteredOnly: true,
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
      checkbox: true,
    },
  };

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    editable: false,
    sortable: true,
    resizable: true,
    filter: true,
    flex: 1,
    minWidth: 100,
  };


  // Data that gets displayed in the grid
  private readonly helper = ''
  public rowSelection = 'multiple';
  public rowGroupPanelShow = 'always';
  public pivotPanelShow = 'always';
  public rowData$ !: User[] | undefined;
  public clients !: User[]
  closeResult : string = ""
  show : boolean = false
  countSelected : number = 0;

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private auth : AuthService ,private service : UserService , private router: Router, private modalService: NgbModal, private toastr: ToastrService) {
    this.helper = this.auth.gettoken();
    this.frameworkComponents = {
      buttonRenderer: ClientButtonRenderComponent,
    }
  }

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.subscribe(
      res => {
        this.roles = res.roles
        this.getClients()
      }
    )

  }
  getClients(){
    if (!this.helper) {
      return of(undefined!);
    }
    if(this.roles && this.roles.map(r => r.name == 'ADMIN' || r.name == 'EMPLOYEE')){
      this.service.getClients(this.helper).subscribe(
        data =>{
          this.clients = data._embedded.users;
          this.rowData$ = data._embedded.users;;
        });
    }

  }
  open(content : any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.onDeleteRow();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${ClientListComponent.getDismissReason(reason)}`;
    });
  }
  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onBtnClick1(e : any) {
      this.router.navigate(['users/client/details', e.rowData.id])
  }
  onDeleteRow() {
    let selectedData = this.agGrid.api.getSelectedRows();
    selectedData.forEach(x =>{
      this.service.deleteClient(x.id ,this.helper).subscribe(result =>{
          this.toastr.success("Client(s) deleted success ","Good Job!", {timeOut: 3000})
          this.getClients()
        },
        err =>{
          this.toastr.error("Error Deleting Client(s)" , "Please Repeat")
        })
    })
  }
  // Example using Grid's API
  clearSelection(): void {
    this.agGrid.api.deselectAll();
  }
  onSelectionChanged(event : any) {

    if (this.agGrid.api.getSelectedRows().length == 0){
      this.show = false
      this.countSelected = this.agGrid.api.getSelectedRows().length
    }
    else {
      this.countSelected = this.agGrid.api.getSelectedRows().length
      this.show = true
    }
  }
  // Example load data from sever
  onGridReady(params: GridReadyEvent) {
    if (!this.helper) {
      return of(undefined!);
    }
    if(this.roles && this.roles.map(r => r.name == 'ADMIN' || r.name == 'EMPLOYEE')){
      this.service.getClients(this.helper).subscribe(
        data =>{
          this.clients = data._embedded.users;
          this.rowData$ = data._embedded.users;
          this.agGrid.api.setRowData(this.rowData$!)
          this.agGrid.api = params.api;
        });
    }
  }
}
