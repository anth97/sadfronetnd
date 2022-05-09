import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.sass'],
})
export class ComposeComponent implements OnInit {
  public Editor = ClassicEditor;

  constructor() {}

  ngOnInit(): void {}
}
