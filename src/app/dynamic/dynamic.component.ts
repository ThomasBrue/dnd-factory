import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css'],
})
export class DynamicComponent implements OnInit {
  @Input() index: number;
  @Input() compInput: string;

  @Output() newStringEvent: EventEmitter<string> = new EventEmitter<string>();
  /*   @Output() outputEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() newArrayEvent: EventEmitter<string[]> = new EventEmitter<
    string[]
  >(); */

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

  constructor() {}

  ngOnInit(): void {}

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
