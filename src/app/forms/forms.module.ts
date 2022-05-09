import { DataService } from './select-item/ng-select.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsRoutingModule } from './forms-routing.module';
import { BasicFormComponent } from './basic-form/basic-form.component';
import { FormsModule as formModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskComponent } from './input-mask/input-mask.component';
import { NgxMaskModule } from 'ngx-mask';
import { SelectItemComponent } from './select-item/select-item.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ArchwizardModule } from 'angular-archwizard';
import { CustomFormsModule } from 'ngx-custom-validators';
import { AdvanceControlComponent } from './advance-control/advance-control.component';
import { FormExampleComponent } from './form-example/form-example.component';
import { FormValidationComponent } from './form-validation/form-validation.component';
import { EditorsComponent } from './editors/editors.component';
import { WizardComponent } from './wizard/wizard.component';



@NgModule({
  declarations: [
    BasicFormComponent,
    InputMaskComponent,
    SelectItemComponent,
    AdvanceControlComponent,
    FormExampleComponent,
    FormValidationComponent,
    EditorsComponent,
    WizardComponent,
    
  ],
  imports: [
    CommonModule,
    FormsRoutingModule,
    NgxMaskModule.forRoot(),
    NgSelectModule,
    CKEditorModule,
    ArchwizardModule,
    CustomFormsModule,
    formModule,
    ReactiveFormsModule,
  ],
  providers: [DataService],
})
export class FormsModule {}
