import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { ProductInfosModel } from '../../model/product-attribute-displayed.model';
import { ResponseProducts } from '../../model/product.model';
import { PercentFormatPipe } from '../../pipes/percent-format.pipe';
import { TrimStringPipe } from '../../pipes/trim-string.pipe';
import { UppercaseFirstLetterFormatPipe } from '../../pipes/uppercase-first-letter-format.pipe';
import { ProductUtils } from '../../utils/product.utils';
import { CardResultGenericService } from './card-result-generic.service';

@Component({
  selector: 'app-card-result-generic',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    PercentFormatPipe,
    UppercaseFirstLetterFormatPipe,
    TrimStringPipe,
  ],
  templateUrl: './card-result-generic.component.html',
  styleUrl: './card-result-generic.component.scss',
})
export class CardResultGenericComponent implements OnInit {
  public isError$ = this.cardResultGenericService.getIsError();
  public isLoading$ = this.cardResultGenericService.getIsLoading();

  @Input() isLineDisposal = false;
  @Input() countProductPerLine = 6;
  productsAttributesToDisplay: ProductInfosModel[] = [];

  private _httpProducts!: ResponseProducts;

  @Input() set httpProducts(httpProducts: ResponseProducts) {
    if (httpProducts !== undefined) {
      this._httpProducts = httpProducts;
      this.productsAttributesToDisplay =
        ProductUtils.setProductsInfoFromResponseProducts(httpProducts);
    }
  }

  get httpProducts() {
    return this._httpProducts;
  }

  public isSelectedCard?: boolean;

  @Input() isPaginated = true;
  @Input() isClickable = false;
  @Input() isSelectableCard = true;
  @Input() pageSize? = 24;
  @Input() isSelectedForMeal = false;
  @Input() isRedirectOnSelect = false;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  pageIndex?: number;
  loading = false;

  constructor(
    private readonly cardResultGenericService: CardResultGenericService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cardResultGenericService.onPageIndexChange$.subscribe(
      (bs) => (this.pageIndex = bs.pageIndex)
    );
  }

  onPageChange(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.cardResultGenericService.onPageChange(this.pageIndex, this.pageSize);
  }

  onSelectItem(productInfo?: ProductInfosModel): void {
    if (this.isRedirectOnSelect) {
      this.router.navigate(['/product', productInfo?.id]);
      this.cardResultGenericService.productIdBs.next(productInfo!.id!);
    } else {
      this.cardResultGenericService.onSelectItem(productInfo!);
    }
  }
}
