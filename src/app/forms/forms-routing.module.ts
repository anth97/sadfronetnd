import { FormValidationComponent } from './form-validation/form-validation.component';
import { BasicFormComponent } from './basic-form/basic-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputMaskComponent } from './input-mask/input-mask.component';
import { SelectItemComponent } from './select-item/select-item.component';
import { AdvanceControlComponent } from './advance-control/advance-control.component';
import { FormExampleComponent } from './form-example/form-example.component';
import { EditorsComponent } from './editors/editors.component';
import { WizardComponent } from './wizard/wizard.component';

const routes: Routes = [
  {
    path: 'basic',
    component: BasicFormComponent,
  },
  {
    path: 'advance-control',
    component: AdvanceControlComponent,
  },
  {
    path: 'form-example',
    component: FormExampleComponent,
  },
  {
    path: 'form-validation',
    component: FormValidationComponent,
  },
  {
    path: 'wizard',
    component: WizardComponent,
  },
  {
    path: 'input-mask',
    component: InputMaskComponent,
  },
  {
    path: 'select-item',
    component: SelectItemComponent,
  },
  {
    path: 'editors',
    component: EditorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}
