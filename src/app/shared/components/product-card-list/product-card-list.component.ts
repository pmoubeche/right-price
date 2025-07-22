import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material/material.module';
import { ProductInfosModel } from '../../model/product-attribute-displayed.model';
import { CardProductComponent } from '../card-product/card-product.component';
import { ProductCardListService } from './product-card-list.service';

@Component({
  standalone: true,
  selector: 'app-product-card-list',
  imports: [MaterialModule, CommonModule, CardProductComponent],
  templateUrl: './product-card-list.component.html',
})
export class ProductCardListComponent implements OnInit, OnDestroy {
  public isError$ = this.productCardListService.getIsError();
  public isLoading$ = this.productCardListService.getIsLoading();

  @Input() set productInfos(productInfos: ProductInfosModel[]) {
    if (productInfos !== undefined) {
      this._productInfos = productInfos;
    }
  }

  get productInfos(): ProductInfosModel[] {
    return this._productInfos;
  }

  _productInfos!: ProductInfosModel[];

  public pageIndex?: number = 0;

  @Output() onChangePage = new EventEmitter<PageEvent>();
  @Output() relaodCards = new EventEmitter<void>();

  public isSelectedCard?: boolean;

  @Input() isPaginated = true;
  @Input() totalElements?: number;
  @Input() pageSize? = 24;
  @Input() pageSizeOptions? = [24];
  @Input() displayDeleteFavoriteButton = false;

  subscription = new Subscription();

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private readonly productCardListService: ProductCardListService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  onPageChange(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.onChangePage.emit(pageEvent);
  }

  onReloadCards(): void {
    this.relaodCards.emit();
  }

  onSelectItem(productInfo?: ProductInfosModel): void {
    this.router.navigate(['/product', productInfo?.id]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
