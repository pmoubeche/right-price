import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateUtils } from '../../shared/utils/date.utils';
import { ProductInfosModel } from '../../shared/model/product-attribute-displayed.model';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  public dateSelectedBs = new BehaviorSubject<string>(
    DateUtils.formatDate(new Date())
  );
  public dateSelected$ = this.dateSelectedBs.asObservable();

  public productInfoModelBs = new BehaviorSubject<ProductInfosModel>(
    new ProductInfosModel()
  );
  public productInfoModel$ = this.productInfoModelBs.asObservable();
}
