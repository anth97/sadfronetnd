import { AuthService } from 'src/app/core/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent  {

  public formSubmitted = false;

  public form = this.formBuilder.group({
    username: ['admin', Validators.required],
    password: ['admin1234', Validators.required],
  })
 
  error: any;

  constructor(
    private formBuilder: FormBuilder,
    private service: AuthService,
    private router: Router
  ) { }
  

  login(){
    this.formSubmitted = true;
    if(!this.form.valid){
      console.log("Error!");
    }

    this.service.login(this.form.value).subscribe((res: any) =>{
      this.service.getUserId(res.id).subscribe(data => {
        this.router.navigate(['/dashboard/main']);
      }, err => console.log(err))
      
    }, error => {
      //alert(error)
      this.error = error;
    })
  }

}
