import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
  <div class="col" style="padding-left: 15px">
   // <a class=" btn btn-sm btn-outline-primary cursor-pointer" (click)="onClick($event,1)">Update</a>
    <a class=" btn btn-sm btn-outline-success cursor-pointer" (click)="onClick($event,2)">View</a>
  </div>`
})

export class AgentButtonRenderComponent implements ICellRendererAngularComp {

  params : any;
  label: string;

  agInit(params : any): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event : any , perm : number) {
    if (perm == 1){
      if (this.params.onClick instanceof Function) {
        // put anything into params u want pass into parents component
        const params = {
          event: $event,
          rowData: this.params.node.data,
          per : 1
          // ...something
        }
        this.params.onClick(params);

      }
    }
    else {
      if (this.params.onClick instanceof Function) {
        // put anything into params u want pass into parents component
        const params = {
          event: $event,
          rowData: this.params.node.data,
          per : 2
          // ...something
        }
        this.params.onClick(params);

      }
    }
  }
}
