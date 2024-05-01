import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductInfosModel } from '../../model/product-attribute-displayed.model';

@Injectable({
  providedIn: 'root',
})
export class CardResultGenericService {
  private onPageIndexChangeBs = new BehaviorSubject<{
    pageIndex: number;
    pageSize?: number;
  }>({ pageIndex: -1 });
  public onPageIndexChange$ = this.onPageIndexChangeBs.asObservable();

  public loadingBs = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingBs.asObservable();

  public selectItemBs = new BehaviorSubject<ProductInfosModel>(
    new ProductInfosModel()
  );
  public selectItem$ = this.selectItemBs.asObservable();

  onPageChange(pageIndex: number, pageSize?: number) {
    this.onPageIndexChangeBs.next({ pageIndex, pageSize });
    this.loadingBs.next(true);
  }

  onSelectItem(product: ProductInfosModel) {
    this.selectItemBs.next(product);
  }
}
