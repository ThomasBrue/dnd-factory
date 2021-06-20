import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { IndexService } from './index.service';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css'],
})
export class DynamicComponent implements AfterViewInit, OnInit {
  @Input() uid: number;
  @Input() compInput: string;

  @Output() newStringEvent: EventEmitter<string> = new EventEmitter<string>();

  //------------------------------------------------------------------------

  mathField: any;
  MQ: any;

  customZIndex: number;

  constructor(public indexService: IndexService) {}

  ngOnInit() {
    this.customZIndex = this.indexService.registerDynComp(this.uid);

    this.indexService.myBoolean.subscribe(() => {
      this.customZIndex = this.indexService.dynCompMap.get(this.uid);
      console.log('uid: ' + this.uid + ' customZindex: ' + this.customZIndex);
    });
  }

  ngAfterViewInit() {
    let myMathField = 'math-field-animated' + this.uid;
    this.mathField = document.getElementById(myMathField);

    //  console.log(this.mathField.getElementByTagName('textarea'));

    this.MQ = (window as any).MathQuill.getInterface(2);
    var mathField = this.MQ.MathField(this.mathField, {
      spaceBehavesLikeTab: true,
    });

    console.log(this.mathField.nativeElement);
  }

  //-------------------------------------------------------------

  dragPosition = { x: 20, y: 20 };

  public xPosition = 20;
  public yPosition = 20;

  childArray = ['childEl-1', 'childEl-2', 'childEl-3'];

  /*   putOutBoolean() {
    this.outputEvent.emit(true);
  } */

  putOutString(value: string) {
    this.newStringEvent.emit(value);
  }

  putOutArray(value: string) {
    this.childArray.push(value);
    // this.newArrayEvent.emit(this.childArray);
  }

  onDragEnded(event) {
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(element);

    this.xPosition = boundingClientRect.x - parentPosition.left;
    this.yPosition = boundingClientRect.y - parentPosition.top;

    console.log(
      'x: ' + (boundingClientRect.x - parentPosition.left),
      'y: ' + (boundingClientRect.y - parentPosition.top)
    );
  }

  getPosition(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }
}
