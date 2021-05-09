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
  mathFieldBridge;
  specialKey_1: String;

  constructor(public indexService: IndexService) {}

  ngOnInit() {
    this.customZIndex = this.indexService.registerDynComp(this.uid);

    this.indexService.mainTrigger.subscribe(() => {
      //     this.customZIndex = this.indexService.dynCompMap.get(this.uid);
      this.customZIndex = this.indexService.mainArray[this.uid].zIndex;

      console.log('uid: ' + this.uid + ' customZindex: ' + this.customZIndex);
    });

    this.indexService.mainArray[this.uid].individualTrigger.subscribe(
      (key: any) => {
        //    if (key && key.length < 2) {
        //--------DEAD --> ^     will be filtered due to length greater than 1-------------------------------------------------------------

        if (key) {
          this.handleKeydownEvent(key);
        }

        //      this.MQ.MathField(this.mathField).write(key);
        //  this.MQ.MathField(this.mathField).focus();
        console.log('YYY: ', this.mathFieldBridge.latex());
        this.indexService.mainArray[
          this.uid
        ].latexOutput = this.mathFieldBridge.latex();
      }
      //   }
    );
  }

  ngAfterViewInit() {
    let myMathField = 'math-field-animated' + this.uid;
    this.mathField = document.getElementById(myMathField);

    //  console.log(this.mathField.getElementByTagName('textarea'));

    this.MQ = (window as any).MathQuill.getInterface(2);
    this.mathFieldBridge = this.MQ.MathField(this.mathField, {
      substituteTextarea: () => {
        return document.getElementById('substitue-id');
      },
      spaceBehavesLikeTab: true,
    });
  }

  //-------------------------------------------------------------

  dragPosition = { x: 20, y: 20 };

  public xPosition = 20;
  public yPosition = 20;

  childArray = ['childEl-1', 'childEl-2', 'childEl-3'];

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

  //-------------------------------------------------------------------------
  //----------------------------------------------------------------------

  handleKeydownEvent(key: string) {
    console.log('Keydown: ', key);
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

        case '=': // Evaluate numerically
          this.MQ.MathField(this.mathField).write('=');
          break;

        case '/': // Division
          this.MQ.MathField(this.mathField).write('\\frac{}{}');
          this.MQ.MathField(this.mathField).keystroke('Up');
          break;

        case '*': // Multiplication
          this.MQ.MathField(this.mathField).write('\\cdot');
          break;

        case 'Dead': // Exponentiation
          this.MQ.MathField(this.mathField).write('^{}');
          this.MQ.MathField(this.mathField).keystroke('Up');
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
          console.log('ArrowUp----------------');
          break;

        case 'ArrowDown':
          this.MQ.MathField(this.mathField).keystroke('DOWN');
          console.log('ArrowDown----------------');
          break;

        default:
          if (
            key !== 'Shift' &&
            key !== 'AltGraph' &&
            key !== 'Backspace' &&
            key !== 'ArrowUp' &&
            key !== 'ArrowDown' &&
            key !== 'ArrowRight' &&
            key !== 'ArrowLeft' &&
            key !== 'Control' &&
            key !== 'Shift' &&
            key !== 'Alt' &&
            key !== 'CapsLock'
          ) {
            this.MQ.MathField(this.mathField).write(key);
          }
      }
    }
  }
}
