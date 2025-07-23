import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductInfosModel } from '../../shared/model/product-attribute-displayed.model';

@Injectable({ providedIn: 'root' })
export class CompareProductService {
  public productInfoModelBs = new BehaviorSubject<ProductInfosModel>(
    new ProductInfosModel()
  );
  public productInfoModel$ = this.productInfoModelBs.asObservable();
}
