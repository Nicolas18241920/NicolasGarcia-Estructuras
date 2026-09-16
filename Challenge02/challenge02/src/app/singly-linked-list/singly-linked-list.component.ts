import { Component, OnInit } from '@angular/core';
import { SinglyLinkedList, Node } from '../models/singly-linked-list';

interface Song {
  title: string;
  artist: string;
}

@Component({
  selector: 'app-singly-linked-list',
  templateUrl: './singly-linked-list.component.html'
})
export class SinglyLinkedListComponent implements OnInit {
  playlist = new SinglyLinkedList<Song>();
  currentSong: Node<Song> | null = null;

  ngOnInit(): void {
    this.playlist.append({ title: 'Bohemian Rhapsody', artist: 'Queen' });
    this.playlist.append({ title: 'Hotel California', artist: 'Eagles' });
    this.playlist.append({ title: 'Billie Jean', artist: 'Michael Jackson' });
    this.playlist.append({ title: 'Smells Like Teen Spirit', artist: 'Nirvana' });

    this.currentSong = this.playlist.head;
  }

  nextSong(): void {
    if (this.currentSong && this.currentSong.next) {
      this.currentSong = this.currentSong.next;
    }
  }
}