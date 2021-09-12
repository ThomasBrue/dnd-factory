import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  public mainTrigger: Subject<boolean> = new Subject<boolean>();
  public mainArray = [];
  public lastIndex = 0;
  public toDeleteComponent: Subject<number> = new Subject<number>();
  public insertionPoint = { x: 100, y: 100 };
  public crossVisible = true;
  public clickedOnElement = false;
  public mouseDownOnElement = false;
  public currentSelectedItemUID = -1;
  public currentSelectedCurserInItemUID = -1;

  constructor() {}

  registerDynComp(uid: number): number {
    this.lastIndex = uid;
    this.mainArray.push({
      uid: uid,
      zIndex: uid,
      individualTrigger: new Subject<boolean>(),
      latexOutput: '',
      insertionPoint: this.insertionPoint,
      isSelected: false,
      selectionTrigger: new Subject<boolean>(),
      cursorInMathfieldTrigger: new Subject<boolean>(),
      writeOjectToMathfieldTrigger: new Subject<object>(),
    });
    return uid;
  }

  moveCompToTop(uid: number) {
    this.mouseDownOnElement = true;

    this.lastIndex = uid;
    this.mainArray.forEach((obj) => {
      if (obj.uid !== uid) {
        this.mainArray[obj.uid].zIndex = 0;
      }
    });
    this.mainArray[uid].zIndex = this.mainArray.length;
    this.mainTrigger.next();
    this.mainArray[uid].individualTrigger.next();
  }

  setClickedOnElement(uid: number) {
    this.currentSelectedItemUID = uid;
  }

  setCursorInMathfield(uid?: number) {
    for (let i = 0; i < this.mainArray.length; i++) {
      if (uid === -1) {
        this.mainArray[i].cursorInMathfieldTrigger.next(false);
        this.currentSelectedCurserInItemUID = -1;
      } else {
        if (this.mainArray[i].uid === this.currentSelectedCurserInItemUID) {
          this.mainArray[i].cursorInMathfieldTrigger.next(true);
        } else {
          this.mainArray[i].cursorInMathfieldTrigger.next(false);
        }
      }
    }
  }

  onClickMathButton(e: any, button) {
    console.log('onClickMathButton');
    for (let i = 0; i < this.mainArray.length; i++) {
      if (this.mainArray[i].uid === this.currentSelectedCurserInItemUID) {
        this.mainArray[i].writeOjectToMathfieldTrigger.next(button);
      }
      e.preventDefault();
    }
  }

  removeComponent(uid) {
    this.toDeleteComponent.next(uid);
  }

  doItemsCollide(itemRefArray, child) {
    itemRefArray.forEach((item) => {
      let aEl = item.location.nativeElement.children[0].getBoundingClientRect();
      if (aEl) {
        aEl.offsetBottom = aEl.top + window.scrollY + aEl.height;
        aEl.offsetTop = aEl.top + window.scrollY;
        aEl.offsetRight = aEl.left + window.scrollX + aEl.width;
        aEl.offsetLeft = aEl.left + window.scrollX;

        let isOverLapping = false;

        if (
          aEl.offsetBottom > child.ankerPointTop &&
          aEl.offsetRight > child.ankerPointLeft &&
          !(aEl.offsetLeft > child.ankerPointLeft + child.myWidth) &&
          !(aEl.offsetTop > child.ankerPointTop + child.myHeight)
        ) {
          isOverLapping = true;
        }

        if (isOverLapping && !this.mainArray[item.instance.uid].isSelected) {
          this.mainArray[item.instance.uid].isSelected = true;
          this.mainArray[item.instance.uid].selectionTrigger.next(true);
        } else if (
          !isOverLapping &&
          this.mainArray[item.instance.uid].isSelected
        ) {
          this.mainArray[item.instance.uid].isSelected = false;
          this.mainArray[item.instance.uid].selectionTrigger.next(false);
        }
      }
    });
  }

  resetSelectionOfAll() {
    this.mainArray.forEach((item) => {
      item.selectionTrigger.next(false);
    });
  }
}
