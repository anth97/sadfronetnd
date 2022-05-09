import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DragulaModule } from 'ng2-dragula';
import { AppsRoutingModule } from './apps-routing.module';
import { ChatComponent } from './chat/chat.component';
import { BlogComponent } from './blog/blog.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { ContactGridComponent } from './contact-grid/contact-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WizardComponent } from 'angular-archwizard';

@NgModule({
  declarations: [ChatComponent, BlogComponent, DragDropComponent, ContactGridComponent],
  imports: [
    CommonModule,
    AppsRoutingModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    FormsModule,
    DragulaModule.forRoot(),
  ],
})
export class AppsModule {}
