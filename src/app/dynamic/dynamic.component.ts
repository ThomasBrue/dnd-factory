import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.css'],
})
export class DynamicComponent implements AfterViewInit {
  @Input() index: number;
  @Input() compInput: string;

  @Output() newStringEvent: EventEmitter<string> = new EventEmitter<string>();

  //------------------------------------------------------------------------

  mathField: any;
  MQ: any;

  /*   ngOnInit() {
    this.mathField = document.getElementById('math-field-animated');

    this.MQ = (window as any).MathQuill.getInterface(2);
    var mathField = this.MQ.MathField(this.mathField, {
      spaceBehavesLikeTab: true,
    });
  } */

  ngAfterViewInit() {
    let hello = 'math-field-animated' + this.index;
    this.mathField = document.getElementById(hello);

    this.MQ = (window as any).MathQuill.getInterface(2);
    var mathField = this.MQ.MathField(this.mathField, {
      spaceBehavesLikeTab: true,
    });
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
