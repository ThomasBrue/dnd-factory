import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  public mainTrigger: Subject<boolean> = new Subject<boolean>();
  public mainArray = [];
  public lastIndex = 0;

  registerDynComp(uid: number): number {
    this.lastIndex = uid;
    this.mainArray.push({
      uid: uid,
      zIndex: uid,
      individualTrigger: new Subject<boolean>(),
      latexOutput: '',
    });
    console.log(this.mainArray);
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

    console.log('moveCompToTop: ', this.mainArray);
  }

  keyInput(key: any) {
    console.log('keyInput------', key);

    console.log('lastComponent: ', this.lastIndex);

    this.mainArray[this.lastIndex].individualTrigger.next(key);
  }

  constructor() {}
}
