import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.sass']
})
export class ResetComponent implements OnInit {


  reactiveForm
  //formBuilder: FormBuilder
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { 
    this.reactiveForm = this.formBuilder.group({
      password: ['',[Validators.required]],
      newPassword: [''],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.reactiveForm.value);
    this.authService.resetPass(this.reactiveForm.value).subscribe(data => {
      console.log(data);
    }, err => console.log(err))
  }

}
