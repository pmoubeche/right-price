import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MaterialModule } from '../../material/material.module';
import { ProductInfosModel } from '../../model/product-attribute-displayed.model';
import { ResponseProducts } from '../../model/product.model';
import { PercentFormatPipe } from '../../pipes/percent-format.pipe';
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
  ],
  templateUrl: './card-result-generic.component.html',
  styleUrl: './card-result-generic.component.scss',
})
export class CardResultGenericComponent implements OnInit {
  productsAttributesToDisplay: ProductInfosModel[] = [];

  itemsCarousel: ProductInfosModel[][] = [];

  private _httpProducts!: ResponseProducts;

  @Input() set httpProducts(httpProducts: ResponseProducts) {
    this._httpProducts = httpProducts;
    this.setProductsInfoFromResponseProducts();
  }

  get httpProducts() {
    return this._httpProducts;
  }

  @Input() isPaginated = true;
  @Input() isClickable = false;
  @Input() isReducedSearch = false;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  pageIndex?: number;
  loading = false;

  @Input() isSlider = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private readonly cardResultGenericService: CardResultGenericService,
    private readonly uppercaseFristLetterPipe: UppercaseFirstLetterFormatPipe
  ) {}

  ngOnInit(): void {
    this.cardResultGenericService.onPageIndexChange$.subscribe(
      (bs) => (this.pageIndex = bs.pageIndex)
    );
    this.cardResultGenericService.loading$.subscribe(
      (loading) => (this.loading = loading)
    );
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onPageChange(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    if (this.isReducedSearch) {
      this.cardResultGenericService.onPageChange(this.pageIndex, 6);
    } else {
      this.cardResultGenericService.onPageChange(this.pageIndex);
    }
  }

  onSelectItem(id?: string): void {
    this.cardResultGenericService.onSelectItem(id!);
  }

  setProductsInfoFromResponseProducts(): void {
    if (this.httpProducts.products) {
      this.httpProducts.page = (
        Number.parseInt(this.httpProducts.page!) - 1
      ).toString();
      this.productsAttributesToDisplay = this.httpProducts.products.map(
        (productApi) =>
          ({
            id: productApi.id,
            image: productApi.image_small_url,
            label: this.uppercaseFristLetterPipe.transform(
              productApi?.product_name!
            ),
            nutriscore: ProductUtils.getUrlNutriscore(
              productApi.nutriscore_grade!
            ),
            ecoscore: ProductUtils.getUrlEcoscore(productApi.ecoscore_grade!),
            novagroup: ProductUtils.getUrlNovagroup(productApi.nova_group!),
          } as ProductInfosModel)
      );
    }
  }
}
