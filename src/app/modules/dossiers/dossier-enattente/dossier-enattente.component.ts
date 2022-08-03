import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, of} from "rxjs";
import {User} from "../../../Models/user";
import {Role} from "../../../Models/role";
import {
  CellClickedEvent,
  CheckboxSelectionCallbackParams,
  ColDef,
  GridReadyEvent,
  HeaderCheckboxSelectionCallbackParams
} from "ag-grid-community";
import {Dossier} from "../../../Models/dossier";
import {AgGridAngular} from "ag-grid-angular";
import {AuthService} from "../../auth";
import {DossierService} from "../../../Services/dossier.service";
import {Router} from "@angular/router";
import {Document} from "../../../Models/document";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "ngx-toastr";
import * as fs from "file-saver";

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
  selector: 'app-dossier-enattente',
  templateUrl: './dossier-enattente.component.html',
  styleUrls: ['./dossier-enattente.component.scss']
})
export class DossierEnattenteComponent implements OnInit {
  user$: Observable<User>;
  private roles : Role[];

  // Each Column Definition results in one Column.
  public columnDefs: ColDef[] = [
    {headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter',
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection},
    {headerName: 'Operation', field: 'operation'},
    {headerName: 'Type Dossier', field: 'typeDossier'},
    {headerName: 'Disponiblilite', field: 'available', cellStyle: params =>
      {
        if (params.value === 3) {
          //mark police cells as red
          return {color: 'white', backgroundColor: 'green'};
        }
        if (params.value === 2) {
          //mark police cells as red
          return {color: 'white', backgroundColor: 'blue'};
        }
        if (params.value === 1) {
          //mark police cells as red
          return {color: 'white', backgroundColor: 'orange'};
        }
        else
          return null;
      },

    },
    {headerName: 'Etat', field: 'etat'},
    {headerName: 'Nombre Documents', field: 'nb_documents',filter: 'agNumberColumnFilter'},
    {headerName: 'Agent', field: 'employeeUsername'},
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
  public rowData$ !: Dossier[] | undefined;
  public dossiers !: Dossier[]
  public details : Document[];
  closeResult : string = ""
  show : boolean = false
  countSelected : number = 0;
  titleMsg : string = '';

  typeDossierDetailsView : string = '';
  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild('sayHelloTemplate', { read: TemplateRef }) sayHelloTemplate:TemplateRef<any>;

  constructor( private auth: AuthService ,private service : DossierService ,private router : Router , private modalService: NgbModal,private toastr: ToastrService) {
    this.helper = this.auth.gettoken();
  }

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.subscribe(
      res => {
        this.roles = res.roles
        this.getDossiersALl()
      }
    )

  }

  // Afficher tout Dossier
  getDossiersALl(){
    if (!this.helper) {
      return of(undefined!);
    }
    if(this.roles && this.roles.map(r => r.name == 'ADMIN')){
      this.service.getDossiersEnAttente(this.helper).subscribe(
        data =>{
          this.dossiers = data._embedded.dossiers
          this.rowData$ = data._embedded.dossiers;
        });
    }
    else if(this.roles && this.roles.map(r => r.name == 'USER')){
      this.service.getLoggedInClientFolders(this.helper , 'Enattente').subscribe(
        data =>{
          this.dossiers = data
          this.rowData$ = data;
        });

    }
  }
  OnDownload(doc : any){
    this.service.DownloadDocument(doc.id , this.helper).subscribe(blob => {
      fs.saveAs(blob , doc.name);
    })
  }
  open(content : any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.onDeleteRow();
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${DossierEnattenteComponent.getDismissReason(reason)}`;
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


  openView(content : any , e : any) {
    this.titleMsg = 'This Document(s) is for Dossier No ' + e.id;
    this.typeDossierDetailsView = e.typeDossier

    this.detailsInfo(e.id)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title-1' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {

      }
    }, (reason) => {
      this.titleMsg = '';
      this.typeDossierDetailsView = ''
      this.closeResult = `Dismissed ${DossierEnattenteComponent.getDismissReason(reason)}`;

    });
  }


  detailsInfo(id : number){
    this.service.getDocuments(id , this.helper).subscribe(data =>{
      this.details=data._embedded.documents;
      console.log(this.details);
    })
  }

  onDeleteRow() {
    let selectedData = this.agGrid.api.getSelectedRows();
    selectedData.forEach(x =>{
      this.service.DeleteDossier(x.id ,this.helper).subscribe(result =>{
          this.toastr.success("Dossiers(s) deleted success ","Good Job!", {timeOut: 3000})
          if (!this.helper) {
            return of(undefined!);
          }
          if(this.roles && this.roles.map(r => r.name == 'ADMIN' )){
            this.service.getAllDossiers(this.helper).subscribe(
              data =>{
                this.dossiers = data
                this.rowData$ = data;
                this.agGrid.api.applyTransaction({remove: selectedData});
              });
          }
          else if(this.roles && this.roles.map(r => r.name == 'EMPLOYEE')){
            this.service.getFreeFolders(this.helper).subscribe(
              data =>{
                this.dossiers = data
                this.rowData$ = data;
                this.agGrid.api.applyTransaction({remove: selectedData});
              });

          }
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
  // Example of consuming Grid Event
  onCellClicked(e: CellClickedEvent): void {
    this.openView(this.sayHelloTemplate , e.data)
  }
  // Example load data from sever
  onGridReady(params: GridReadyEvent) {
    if (!this.helper) {
      return of(undefined!);
    }
    if(this.roles && this.roles.map(r => r.name == 'ADMIN')){
      this.service.getDossiersEnAttente(this.helper).subscribe(
        data =>{
          this.dossiers = data._embedded.dossiers
          this.rowData$ = data._embedded.dossiers;
          this.agGrid.api.setRowData(this.rowData$!)
          this.agGrid.api = params.api;
        });
    }
    else if(this.roles && this.roles.map(r => r.name == 'USER')){
      this.service.getLoggedInClientFolders(this.helper , 'Enattente').subscribe(
        data =>{
          this.dossiers = data
          this.rowData$ = data;
          this.agGrid.api.setRowData(this.rowData$)
          this.agGrid.api = params.api;
        });

    }
  }
}
