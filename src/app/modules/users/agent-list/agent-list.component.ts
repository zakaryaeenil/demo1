import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable, of} from "rxjs";
import {User} from "../../../Models/user";
import {Role} from "../../../Models/role";
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  GridReadyEvent,
  HeaderCheckboxSelectionCallbackParams
} from "ag-grid-community";
import {AgGridAngular} from "ag-grid-angular";
import {AuthService} from "../../auth";
import {UserService} from "../../../Services/user.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

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
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss']
})
export class AgentListComponent implements OnInit {

  user$: Observable<User>;
  private roles : Role[];
  // Each Column Definition results in one Column.
  public columnDefs: ColDef[] = [
    {headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter',
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection,},
    {headerName: 'Name', field: 'username'},
    {headerName: 'Email', field: 'email'},
    {headerName: 'Count Reservations', field: 'countReservations',filter: 'agNumberColumnFilter'},
    {headerName: 'First Name', field: 'firstName'},
    {headerName: 'Last Name', field: 'lastName'},
    {headerName: 'Is Enabled', field: 'enabled'},
    {headerName: 'Created', field: 'createdAt' ,filter: 'agDateColumnFilter', filterParams: filterParams},
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
  private helper = ''
  public rowSelection = 'multiple';
  public rowGroupPanelShow = 'always';
  public pivotPanelShow = 'always';
  public rowData$ !: User[] | undefined;
  public agents !: User[]

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(private auth : AuthService ,private service : UserService , private router: Router , private toastr: ToastrService) {
    this.helper = this.auth.gettoken();
  }

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.subscribe(
      res => {
        this.roles = res.roles
        this.getAgents()
      }
    )

  }

  getAgents(){
    if (!this.helper) {
      return of(undefined!);
    }
    if(this.roles && this.roles.map(r => r.name == 'ADMIN' )){
      this.service.getAgents(this.helper).subscribe(
        data =>{
          this.agents = data._embedded.users;
          this.rowData$ = data._embedded.users;;
        });
    }

  }

  // Example load data from sever
  onGridReady(params: GridReadyEvent) {
    if (!this.helper) {
      return of(undefined!);
    }
    if(this.roles && this.roles.map(r => r.name == 'ADMIN' || r.name == 'EMPLOYEE')){
      this.service.getAgents(this.helper).subscribe(
        data =>{
          this.agents = data._embedded.users;
          this.rowData$ = data._embedded.users;
          this.agGrid.api.setRowData(this.rowData$!)
          this.agGrid.api = params.api;
        });
    }
  }
}
