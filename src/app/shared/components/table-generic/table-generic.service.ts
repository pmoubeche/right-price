import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TableGenericService {
  private behaviorSubjectOnPageIndexChange = new BehaviorSubject<number>(-1);
  public onPageIndexChangeObs =
    this.behaviorSubjectOnPageIndexChange.asObservable();

  constructor() {}

  sendPageIndex(pageIndex: number) {
    this.behaviorSubjectOnPageIndexChange.next(pageIndex);
  }
}
