import { Component, OnInit } from '@angular/core';
import { DoublyLinkedList, DoubleNode } from '../models/doubly-linked-list';

interface Page {
  title: string;
  url: string;
}

@Component({
  selector: 'app-doubly-linked-list',
  templateUrl: './doubly-linked-list.component.html'
})
export class DoublyLinkedListComponent implements OnInit {
  history = new DoublyLinkedList<Page>();
  currentPage: DoubleNode<Page> | null = null;

  ngOnInit(): void {
    this.history.append({ title: 'Google', url: 'https://google.com' });
    this.history.append({ title: 'GitHub', url: 'https://github.com' });
    this.history.append({ title: 'Stack Overflow', url: 'https://stackoverflow.com' });
    const last = this.history.append({ title: 'Angular Docs', url: 'https://angular.io' });

    this.currentPage = last;
  }

  goBack(): void {
    if (this.currentPage && this.currentPage.prev) {
      this.currentPage = this.currentPage.prev;
    }
  }

  goForward(): void {
    if (this.currentPage && this.currentPage.next) {
      this.currentPage = this.currentPage.next;
    }
  }
}