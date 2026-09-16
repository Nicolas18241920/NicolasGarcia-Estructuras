import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SinglyLinkedListComponent } from './singly-linked-list/singly-linked-list.component';
import { DoublyLinkedListComponent } from './doubly-linked-list/doubly-linked-list.component';

const routes: Routes = [
  { path: 'singly-linked-list', component: SinglyLinkedListComponent },
  { path: 'doubly-linked-list', component: DoublyLinkedListComponent },
  { path: '', redirectTo: '/singly-linked-list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }