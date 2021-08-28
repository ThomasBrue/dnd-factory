import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-selection-box',
  templateUrl: './selection-box.component.html',
  styleUrls: ['./selection-box.component.css'],
})
export class SelectionBoxComponent implements OnInit {
  myWidth = 0;
  myHeight = 0;

  ankerPointTop = 0;
  ankerPointLeft = 0;

  isVisible = false;

  constructor() {}

  ngOnInit(): void {}
}
