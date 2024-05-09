import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChartService {
  public isDisplayedLegendBs = new BehaviorSubject<boolean>(false);
  public isDisplayedLegend$ = this.isDisplayedLegendBs.asObservable();
}
