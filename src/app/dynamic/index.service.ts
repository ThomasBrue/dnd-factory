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

  //public cursorPosition = 0;

  registerDynComp(uid: number): number {
    this.lastIndex = uid;
    this.mainArray.push({
      uid: uid,
      zIndex: uid,
      individualTrigger: new Subject<boolean>(),
      latexOutput: '',
      insertionPoint: this.insertionPoint,
    });
    return uid;
  }

  moveCompToTop(uid: number) {
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

  setClickedOnElement() {
    console.log('indexService_CLICK');
    this.clickedOnElement = true;
  }

  removeComponent(uid) {
    this.toDeleteComponent.next(uid);
  }

  keyInput(key: any) {
    this.mainArray[this.lastIndex].individualTrigger.next(key);
  }

  constructor() {}
}
