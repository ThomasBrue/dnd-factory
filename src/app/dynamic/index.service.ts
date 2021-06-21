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

  registerDynComp(uid: number): number {
    this.lastIndex = uid;
    this.mainArray.push({
      uid: uid,
      zIndex: uid,
      individualTrigger: new Subject<boolean>(),
      latexOutput: '',
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

  removeComponent(uid) {
    this.toDeleteComponent.next(uid);
  }

  keyInput(key: any) {
    this.mainArray[this.lastIndex].individualTrigger.next(key);
  }

  constructor() {}
}
