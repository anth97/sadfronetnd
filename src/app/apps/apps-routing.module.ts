import { ContactGridComponent } from './contact-grid/contact-grid.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog/blog.component';
import { ChatComponent } from './chat/chat.component';
import { DragDropComponent } from './drag-drop/drag-drop.component';

const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'blog',
    component: BlogComponent,
  },
  {
    path: 'dragdrop',
    component: DragDropComponent,
  },
  {
    path: 'contact-grid',
    component: ContactGridComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsRoutingModule {}
