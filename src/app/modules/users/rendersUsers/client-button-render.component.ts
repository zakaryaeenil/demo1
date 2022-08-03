import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
  <div class="col" style="padding-left: 15px">
    <a class=" btn btn-sm btn-outline-success cursor-pointer" (click)="onClick($event)">View</a>
  </div>`
})

export class ClientButtonRenderComponent implements ICellRendererAngularComp {

  params : any;
  label: string;

  agInit(params : any): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event : any) {
      if (this.params.onClick instanceof Function) {
        // put anything into params u want pass into parents component
        const params = {
          event: $event,
          rowData: this.params.node.data,
        }
        this.params.onClick(params);

      }
  }
}
