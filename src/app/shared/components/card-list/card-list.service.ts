import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardListService {
  public loadingBs = new BehaviorSubject<boolean>(false);

  public isErrorBs = new BehaviorSubject<boolean>(false);

  getIsError(): Observable<boolean> {
    return this.isErrorBs.asObservable();
  }

  getIsLoading(): Observable<boolean> {
    return this.loadingBs.asObservable();
  }
}
