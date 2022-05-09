import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.sass'],
})
export class ButtonsComponent implements OnInit {
  public checkboxGroupForm: FormGroup;
  public radioGroupForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}
  model = {
    left: true,
    middle: false,
    right: false,
  };
  // Radio Buttons
  modelRadio = 1;
  ngOnInit() {
    this.checkboxGroupForm = this.formBuilder.group({
      left: true,
      middle: false,
      right: false,
    });
    this.radioGroupForm = this.formBuilder.group({
      modelRadioForm: 'Left',
    });
  }
}
