import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DossiersComponent} from "../dossiers/dossiers.component";
import {DossierListComponent} from "../dossiers/dossier-list/dossier-list.component";
import {DossierCreateComponent} from "../dossiers/dossier-create/dossier-create.component";
import {DossierMyComponent} from "../dossiers/dossier-my/dossier-my.component";
import {DossierImportComponent} from "../dossiers/dossier-import/dossier-import.component";
import {DossierExportComponent} from "../dossiers/dossier-export/dossier-export.component";
import {DossierEnattenteComponent} from "../dossiers/dossier-enattente/dossier-enattente.component";
import {DossierEnntraitementComponent} from "../dossiers/dossier-enntraitement/dossier-enntraitement.component";
import {DossierCompletedComponent} from "../dossiers/dossier-completed/dossier-completed.component";
import {UsersComponent} from "./users.component";
import {ClientListComponent} from "./client-list/client-list.component";
import {AgentListComponent} from "./agent-list/agent-list.component";
import {ClientDetailsComponent} from "./client-details/client-details.component";

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'clients',
        component: ClientListComponent,
      },
      {
        path: 'client/details/:id',
        component: ClientDetailsComponent,
      },
      {
        path: 'agents',
        component: AgentListComponent,
      },
      { path: '', redirectTo: 'clients', pathMatch: 'full' },
      { path: '**', redirectTo: 'clients', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
