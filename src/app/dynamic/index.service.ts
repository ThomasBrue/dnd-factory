import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexService {
  public dynCompMap = new Map();
  public myBoolean: Subject<boolean> = new Subject<boolean>();

  registerDynComp(uid: number): number {
    this.dynCompMap.set(uid, this.dynCompMap.size);
    return this.dynCompMap.size;
  }

  moveCompToTop(uid: number) {
    for (let [key, value] of this.dynCompMap) {
      if (uid !== key) {
        this.dynCompMap.set(key, 0);
      }
    }
    this.dynCompMap.set(uid, this.dynCompMap.size);
    this.myBoolean.next(true);

    console.log('moveCompToTop: ', this.dynCompMap);
  }

  constructor() {}
}
