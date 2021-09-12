import { Component, HostListener, OnInit } from '@angular/core';
import { IndexService } from './../dynamic/index.service';

@Component({
  selector: 'app-insertion-cross',
  templateUrl: './insertion-cross.component.html',
  styleUrls: ['./insertion-cross.component.css'],
})
export class InsertionCrossComponent implements OnInit {
  positionTop = 100;
  positionLeft = 100;

  constructor(public indexService: IndexService) {}

  ngOnInit(): void {}
}
