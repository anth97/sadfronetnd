import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidator } from 'src/app/authentication/actualizar-clave/CustomValidator';

import { AuthService } from 'src/app/core/service/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-clave',
  templateUrl: './actualizar-clave.component.html',
  styleUrls: ['./actualizar-clave.component.sass']
})
export class ActualizarClaveComponent implements OnInit {

  updateForm: FormGroup;
  submitted = false;
  error = '';

  showBasicMessage() {
    
    Swal.fire({
      
      text: "Contraseña actualizada",
      confirmButtonText:'Ok',
      confirmButtonColor: '#43C05B',
      
      
      
    }).then(() => {
      this.router.navigateByUrl('#')
    });
    
  }
  
  showTitleErorIcon() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Contraseña actual incorrecta',
      confirmButtonText: 'Ok',
      
    });
  }

  

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    
    private authService: AuthService, ) {
    
   }

  ngOnInit(): void {
    

    
    this.updateForm = this.formBuilder.group({
      actualPassword: ["", Validators.required],
      newPassword: ["",Validators.compose([
         Validators.required,
         // 2. check whether the entered password has a number
         CustomValidator.patternValidator(/\d/, { hasNumber: true }),
         // 3. check whether the entered password has upper case letter
         CustomValidator.patternValidator(/[A-Z]/, { hasCapitalCase: true }),
         // 4. check whether the entered password has a lower-case letter
         CustomValidator.patternValidator(/[a-z]/, { hasSmallCase: true }),

         Validators.minLength(8),

         Validators.maxLength(16),

         CustomValidator.nameValidator,
      ])],
      confirmPassword: ["",Validators.compose([ Validators.required, Validators.minLength(8)])]
      },{
        validator: CustomValidator.passwordMatchValidator

      }
       
    );


  }

 
  

  

  onSubmit() {
    this.submitted = true;
    this.error = '';

    

    if (this.updateForm.invalid) {
      this.error = 'Invalid data !';
      return;
    } else {
      // register user call here..
    }

    this.authService.resetPass(this.data()).subscribe(data => {
      console.log(data);
      this.showBasicMessage();

      
      

    }, (err) => {console.log(err);
      
      this.showTitleErorIcon();
    
    }
    
    )

    
    


    

  }
  
  data(){
    let data={
      "password": this.updateForm.controls['actualPassword'].value,
      "newPassword": this.updateForm.controls['newPassword'].value,
    }
    
    return data 
      
  }
  
  cancelar(){
    this.router.navigateByUrl('#')
  }

  

  
  

}
