import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DossiersRoutingModule } from './dossiers-routing.module';
import { DossierListComponent } from './dossier-list/dossier-list.component';
import { DossierImportComponent } from './dossier-import/dossier-import.component';
import { DossierExportComponent } from './dossier-export/dossier-export.component';
import { DossierEnattenteComponent } from './dossier-enattente/dossier-enattente.component';
import { DossierCompletedComponent } from './dossier-completed/dossier-completed.component';
import { DossierEnntraitementComponent } from './dossier-enntraitement/dossier-enntraitement.component';
import { DossierMyComponent } from './dossier-my/dossier-my.component';
import { DossiersComponent } from './dossiers.component';
import { DossierCreateComponent } from './dossier-create/dossier-create.component';
import {AgGridModule} from "ag-grid-angular";
import {FormsModule} from "@angular/forms";
import {ToastrModule} from "ngx-toastr";
import {DossierButtonRenderComponent} from "./dossierRenders/dossier-button-render.component";


@NgModule({
  declarations: [
    DossierListComponent,
    DossierImportComponent,
    DossierExportComponent,
    DossierEnattenteComponent,
    DossierCompletedComponent,
    DossierEnntraitementComponent,
    DossierMyComponent,
    DossiersComponent,
    DossierCreateComponent,
    DossierButtonRenderComponent
  ],
  imports: [
    CommonModule,
    DossiersRoutingModule,
    AgGridModule,
    FormsModule,
    ToastrModule,


  ]
})
export class DossiersModule { }
