import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  public selectItemBs = new BehaviorSubject<string>('');
  public selectItem$ = this.selectItemBs.asObservable();

  constructor() {}

  onPageChange(pageIndex: number, pageSize?: number) {
    this.onPageIndexChangeBs.next({ pageIndex, pageSize });
    this.loadingBs.next(true);
  }

  onSelectItem(itemId: string) {
    this.selectItemBs.next(itemId);
  }
}
