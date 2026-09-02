import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SinglyLinkedListComponent } from './singly-linked-list/singly-linked-list.component';
import { DoublyLinkedListComponent } from './doubly-linked-list/doubly-linked-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SinglyLinkedListComponent,
    DoublyLinkedListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }