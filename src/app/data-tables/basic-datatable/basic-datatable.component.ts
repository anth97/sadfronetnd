import { Component, ViewChild, HostListener } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
@Component({
  selector: 'app-basic-datatable',
  templateUrl: './basic-datatable.component.html',
  styleUrls: ['./basic-datatable.component.sass'],
})
export class BasicDatatableComponent {
  rows = [];
  loadingIndicator = true;
  reorderable = true;
  scrollBarHorizontal = window.innerWidth < 1200;

  @ViewChild('table') table: DatatableComponent;

  constructor() {
    this.fetch((data) => {
      this.rows = data;
      setTimeout(() => {
        this.loadingIndicator = false;
      }, 500);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.scrollBarHorizontal = window.innerWidth < 1200;
    this.table.recalculate();
    this.table.recalculateColumns();
  }

  getRowHeight(row) {
    return row.height;
  }
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/datatable-data.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
}
