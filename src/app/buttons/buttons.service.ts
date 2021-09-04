import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IndexService } from '../dynamic/index.service';

enum ButtonType {
  OPERATIONAL = 'OPERATIONAL',
  REGULAR = 'REGULAR',
}

@Injectable({
  providedIn: 'root',
})
export class ButtonsService {
  constructor(private indexService: IndexService) {}

  /* buttonsTrigger = new Subject<object>(); */

  buttons = [
    this.buildRegularButton('+'),
    this.buildRegularButton('-'),
    this.buildRegularButton('*'),
    this.buildRegularButton('.'),
    this.buildRegularButton('='),

    this.buildRegularButton('^', '1_superscript.png'),
    this.buildRegularButton('\\frac', '2_frac_v1.png'),
    this.buildWriteButton('\\frac{d}{dx}', '2_frac_v2_mathrm.png'),

    this.buildWriteButton('\\frac{\\text{d}}{\\text{d}x}', 'idiot'),

    this.buildWriteButton(
      '\\frac{\\partial }{\\partial x}',
      '2_frac_v2_partial.png'
    ),

    this.buildRegularButton('\\sum', '3_sum.png'),
    this.buildRegularButton('\\sqrt', '4_sqrt_v1.png'),
    this.buildWriteButton('\\sqrt[]{}', '4_sqrt_v2.png'),

    this.buildRegularButton('\\int', '7_int_v1.png'),
    this.buildRegularButton('\\intx', '7_int_v2.png'),
    this.buildRegularButton('\\inty', '7_int_v1.png'),

    this.buildWriteButton('_{}\\textrm{}', '9_textrm_v1_down.png'),
    this.buildWriteButton('^{}\\textrm{}', '9_textrm_v2_up.png'),
    this.buildWriteButton('_{}^{}\\textrm{}', '9_textrm_v3_upDown.png'),
    this.buildWriteButton('_{}', '11_subscript.png'),

    this.buildWriteButton('\\rightarrow', '13_rightArrow_v1.png'),

    //--------------------------------------------------------------------

    this.buildOperationalButton('Backspace', 'myBackspace'),
    this.buildOperationalButton('Shift-Left', 'Shift-Left'),
    this.buildOperationalButton('Left', 'Left'),
    this.buildOperationalButton('Up', 'Up'),
    // mathField.keystroke('Shift-Left');

    this.buildRegularButton('\\intIndef', '7_int_v1.png'),
    this.buildRegularButton('\\intDef', '7_int_v2.png'),

    this.buildRegularButton('\\deriOne', '2_frac_v2_mathrm.png'),
    this.buildRegularButton('\\deriNth', '12_deriNth_v1.png'),

    this.buildRegularButton('\\matrix', 'matrix'),

    // \begin{matrix}c&\\&\end{matrix}        --> OUTPUT--SOLL
    // \begin{matrix}\frac{ }{ }&\&\end{matrix}     --> HABEN

    //  this.buildWriteButton('\\begin{matrix}c&\\\\&\\end{matrix}', 'writeMatrix'),
    /* this.buildWriteButton(
      '\\begin{matrix}c&\\\\&\\\\&\\end{matrix}',
      'writeMatrix'
    ), */
    this.buildWriteButton(
      '\\begin{matrix}&&&\\\\&\\\\&\\\\&\\end{matrix}',
      'writeMatrix'
    ),

    this.buildWriteButton('\\deriOne{x}{x^2+\\deriOne{x}{x^3}}', 'AAAA'),

    this.buildWriteButton('\\intIndef{x^2+\\intIndef{x^3}{x}}{x}', 'BBBB'),
    this.buildWriteButton('s\\cdot \\frac{w\\cdot u}{t}\\cdot d', 'CCCC'),
  ];

  /*   onClickMathButton(e: any, button, mathField, mathFieldXXX, MQ): string {
    console.log(e, button);
    if (button.action === 'write') {
      MQ.MathField(mathField).write(button.content);
    } else if (button.action === 'cmd') {
      MQ.MathField(mathField).cmd(button.content);
    } else {
      MQ.MathField(mathField).keystroke(button.content);
    }
    MQ.MathField(mathField).focus();
    e.preventDefault();

    return mathFieldXXX.latex();
  } */

  buildRegularButton(content: string, displayContent?: string) {
    return {
      displayContent: displayContent ? displayContent : '',
      content: content,
      type: ButtonType.REGULAR,
      action: 'cmd',
    };
  }

  buildWriteButton(content: string, displayContent?: string) {
    return {
      displayContent: displayContent ? displayContent : '',
      content: content,
      type: ButtonType.REGULAR,
      action: 'write',
    };
  }

  buildOperationalButton(content: any, iconId: any, iconType?: string) {
    return {
      content: content,
      displayContent: iconId,
      action: 'keystroke',
      iconId: iconId,
      iconType: iconType ? iconType : 'material',
      type: ButtonType.OPERATIONAL,
    };
  }
}
