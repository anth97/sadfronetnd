import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.sass'],
})
export class AccordionComponent implements OnInit {
  constructor() {}
  acc: any;
  disabled = false;
  content =
    'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf' +
    'moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.' +
    'Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda' +
    'shoreditch et. Nihil anim keffiyeh helvetica,';

  ngOnInit(): void {}
}
