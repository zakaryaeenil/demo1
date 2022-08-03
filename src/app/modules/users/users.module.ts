import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { AgentListComponent } from './agent-list/agent-list.component';
import { AgentDetailsComponent } from './agent-details/agent-details.component';
import {ToastrModule} from "ngx-toastr";
import {AgGridModule} from "ag-grid-angular";
import {AgentButtonRenderComponent} from "./rendersUsers/agent-button-render.component";
import {ClientButtonRenderComponent} from "./rendersUsers/client-button-render.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";


@NgModule({
  declarations: [
    UsersComponent,
    ClientListComponent,
    ClientDetailsComponent,
    AgentListComponent,
    AgentDetailsComponent,
    AgentButtonRenderComponent,
    ClientButtonRenderComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NgbModule,
    ToastrModule,
    AgGridModule,
  ]
})
export class UsersModule { }
