import { Component, HostListener, OnInit } from '@angular/core';
import { IndexService } from './../dynamic/index.service';

@Component({
  selector: 'app-insertion-cross',
  templateUrl: './insertion-cross.component.html',
  styleUrls: ['./insertion-cross.component.css'],
})
export class InsertionCrossComponent implements OnInit {
  dragPosition = { x: 100, y: 100 };

  constructor(public indexService: IndexService) {}

  ngOnInit(): void {}

  @HostListener('document:click', ['$event'])
  clickout(event) {
    this.dragPosition = {
      x: event.clientX + window.scrollX - 11,
      y: event.clientY + window.scrollY - 11,
    };

    this.indexService.insertionPoint = this.dragPosition;
  }
}
