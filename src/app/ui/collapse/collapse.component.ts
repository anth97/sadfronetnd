import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.sass'],
})
export class CollapseComponent implements OnInit {
  isCollapsed = false;
  constructor() {}

  ngOnInit(): void {}
}
