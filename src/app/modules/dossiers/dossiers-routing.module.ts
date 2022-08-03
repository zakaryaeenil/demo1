import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WidgetsExamplesComponent} from "../widgets-examples/widgets-examples.component";
import {ListsComponent} from "../widgets-examples/lists/lists.component";
import {StatisticsComponent} from "../widgets-examples/statistics/statistics.component";
import {ChartsComponent} from "../widgets-examples/charts/charts.component";
import {MixedComponent} from "../widgets-examples/mixed/mixed.component";
import {TablesComponent} from "../widgets-examples/tables/tables.component";
import {FeedsComponent} from "../widgets-examples/feeds/feeds.component";
import {DossiersComponent} from "./dossiers.component";
import {DossierListComponent} from "./dossier-list/dossier-list.component";
import {DossierMyComponent} from "./dossier-my/dossier-my.component";
import {DossierImportComponent} from "./dossier-import/dossier-import.component";
import {DossierExportComponent} from "./dossier-export/dossier-export.component";
import {DossierEnattenteComponent} from "./dossier-enattente/dossier-enattente.component";
import {DossierEnntraitementComponent} from "./dossier-enntraitement/dossier-enntraitement.component";
import {DossierCompletedComponent} from "./dossier-completed/dossier-completed.component";
import {DossierCreateComponent} from "./dossier-create/dossier-create.component";

const routes: Routes = [
  {
    path: '',
    component: DossiersComponent,
    children: [
      {
        path: 'lists',
        component: DossierListComponent,
      },
      {
        path: 'create',
        component: DossierCreateComponent,
      },
      {
        path: 'my',
        component: DossierMyComponent,
      },
      {
        path: 'imports',
        component: DossierImportComponent,
      },
      {
        path: 'exports',
        component: DossierExportComponent,
      },
      {
        path: 'enattentes',
        component: DossierEnattenteComponent,
      },
      {
        path: 'entraitements',
        component: DossierEnntraitementComponent,
      },
      {
        path: 'completed',
        component: DossierCompletedComponent,
      },
      { path: '', redirectTo: 'lists', pathMatch: 'full' },
      { path: '**', redirectTo: 'lists', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DossiersRoutingModule { }
