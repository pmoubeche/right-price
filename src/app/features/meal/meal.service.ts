import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateUtils } from '../../shared/utils/date.utils';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  public dateSelectedBs = new BehaviorSubject<string>(
    DateUtils.formatDate(new Date())
  );
  public dateSelected$ = this.dateSelectedBs.asObservable();
}
