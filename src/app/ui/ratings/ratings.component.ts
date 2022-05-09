import { Component } from '@angular/core';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.sass'],
})
export class RatingsComponent {
  currentRate = 8;
  selected = 0;
  hovered = 0;
  readonly = false;
  currentRate2 = 3.14;
  constructor() {}
}
