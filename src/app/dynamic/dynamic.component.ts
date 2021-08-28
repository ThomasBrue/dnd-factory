import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
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
  @Output() closed = new EventEmitter();
  @Output() closeEvent = new EventEmitter<number>();

  dragPosition = { x: 0, y: 0 };

  deltaX = 0;
  deltaY = 0;

  mathField: any;
  MQ: any;
  customZIndex: number;
  mathFieldBridge;
  specialKey_1: String;
  itemIsSelected = false;
  mouseDownOnItem = false;

  constructor(public indexService: IndexService) {}

  ngOnInit() {
    this.customZIndex = this.indexService.registerDynComp(this.uid);
    this.indexService.mainTrigger.subscribe(() => {
      this.customZIndex = this.indexService.mainArray[this.uid].zIndex;
    });

    this.indexService.mainArray[this.uid].individualTrigger.subscribe(() => {
      this.indexService.mainArray[this.uid].latexOutput =
        this.mathFieldBridge.latex();
    });

    this.indexService.mainArray[this.uid].selectionTrigger.subscribe(
      (isSelectedPayload) => {
        this.itemIsSelected = isSelectedPayload;
      }
    );

    this.dragPosition = this.indexService.insertionPoint;
  }

  ngAfterViewInit() {
    let myMathField = 'math-field-animated' + this.uid;
    this.mathField = document.getElementById(myMathField);
    this.MQ = (window as any).MathQuill.getInterface(2);
    this.mathFieldBridge = this.MQ.MathField(this.mathField, {
      spaceBehavesLikeTab: true,
    });

    this.MQ.MathField(this.mathField).focus();
  }

  logLatex() {
    console.log('logLatex: ', this.mathFieldBridge.latex());
  }

  removeComponent(uid: number) {
    this.indexService.removeComponent(uid);
  }

  putOutString(value: string) {
    this.newStringEvent.emit(value);
  }

  onDragEnded(event) {
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(element);
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

  /*   onlyTriggerParent(event){

    console.log("this: ", this)
    console.log("target: ", event.target);
    

    if (event.target !== this){
      console.log("clicked CHILD");  
    }else{
      console.log("clicked PARENT");

    }
  } */

  /*   $('.foobar').on('click', function(e) {
    if (e.target !== this)
      return;
    
    alert( 'clicked the foobar' );
  }); */

  /* handleKeydownEvent(key: string) {
    console.log('Keydown: ', key);

    if (key === 'Backspace') {
      this.indexService.removeComponent(this.uid);
    }

    if (this.specialKey_1 == '') {
      if (key === 'Shift') {
        this.specialKey_1 = key;
      } else if (key === 'Alt') {
        this.specialKey_1 = key;
      } else if (key === 'Control') {
        this.specialKey_1 = key;
      }
    } else if (this.specialKey_1 == 'Control' && key == 'AltGraph') {
      this.specialKey_1 = 'Control';
    }

    if (this.specialKey_1 == 'Control') {
      switch (key) {
        case ',':
          this.MQ.MathField(this.mathField).keystroke('Right');
          this.MQ.MathField(this.mathField).keystroke('Right');
          this.MQ.MathField(this.mathField).keystroke('Right');
          this.MQ.MathField(this.mathField).keystroke('Right');
          this.MQ.MathField(this.mathField).keystroke('Right');
          this.MQ.MathField(this.mathField).keystroke('Right');
          this.MQ.MathField(this.mathField).write('\\rightarrow');
          break;
        case '\\': // nth root (Calculator Toolbar)
          this.MQ.MathField(this.mathField).write('\\sqrt[]{}');
          break;
        case 'i':
          this.MQ.MathField(this.mathField).cmd('\\intIndef');
          break;
      }
    } else {
      switch (key) {
        //----Keystroke Commands-----------------------------------------------------------------------------------------------------------------
        case '_':
          this.MQ.MathField(this.mathField).write('_{}');
          this.MQ.MathField(this.mathField).keystroke('Down');
          break;

        case '"':
          this.MQ.MathField(this.mathField).write(' \\overline{}');
          this.MQ.MathField(this.mathField).keystroke('Left');
          break;
        //----Calculator Toolbar----------------------------------------------------------------------------------------------------------------
        case '|': // Absolute value
          this.MQ.MathField(this.mathField).write('\\left |  \\right |');
          this.MQ.MathField(this.mathField).keystroke('Left');
          break;

        case ':': // Definition
          this.MQ.MathField(this.mathField).write(':=');
          break;

        case "'": // Parentheses
          //  this.MQ.MathField(this.mathField).write("( )");
          this.MQ.MathField(this.mathField).write('\\left (  \\right )');
          this.MQ.MathField(this.mathField).keystroke('Left');
          break;

        case '\\': // square root
          this.MQ.MathField(this.mathField).write('\\sqrt{}');
          this.MQ.MathField(this.mathField).keystroke('Left');
          break;

        //----Calculus Toolbar---------------------------------------------------------------------------------------------------------------------
        case '?': // derivative
          //   this.MQ.MathField(this.mathField).write('\\frac{d}{dx}');
          this.MQ.MathField(this.mathField).cmd('\\deriOne');
          break;

        case '&': // indefinite integral (Calculus Toolbar)
          this.MQ.MathField(this.mathField).write('\\intIndef');
          break;

        case 'ArrowUp':
          this.MQ.MathField(this.mathField).keystroke('UP');
          break;

        case 'ArrowDown':
          this.MQ.MathField(this.mathField).keystroke('DOWN');
          break;
      }
    }
  } */
}
