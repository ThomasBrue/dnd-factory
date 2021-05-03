import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  public dynCompMap = new Map();
  //dynCompMap: Subject<Map> = new Subject<boolean>();
  // dynCompMap = new Subject<Map>();

  public myBoolean: Subject<boolean> = new Subject<boolean>();

  registerDynComp(uid: number): number {
    this.dynCompMap.set(uid, this.dynCompMap.size);
    return this.dynCompMap.size;
  }

  //  z < uid

  moveCompToTop(uid: number) {
    this.myBoolean.next(true);

    for (let [key, value] of this.dynCompMap) {
      /*       if (value >= uid && uid !== key) {
        this.dynCompMap.set(key, value - 1);
      } */
      if (uid !== key) {
        this.dynCompMap.set(key, 0);
      }
    }

    this.dynCompMap.set(uid, this.dynCompMap.size);

    console.log('moveCompToTop: ', this.dynCompMap);
  }

  constructor() {}
}
