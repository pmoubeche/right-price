import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { ProductInfosModel } from '../../model/product-attribute-displayed.model';
import { ResponseProducts } from '../../model/product.model';
import { ProductUtils } from '../../utils/product.utils';
import { CardProductComponent } from '../card-product/card-product.component';
import { CardResultGenericService } from './card-result-generic.service';
import { SearchFavoriteService } from '../../common/paginated/search-favorite.service';
import { EMPTY, Subscription, switchMap, tap } from 'rxjs';
import { FavoriteFilterModel, FavoriteModel } from '../../../../generated';
import { PageRequest } from '../../common/paginated/page';
import { ContextService } from '../../services/context.service';

@Component({
  standalone: true,
  selector: 'app-card-result-generic',
  imports: [MaterialModule, CommonModule, CardProductComponent],
  templateUrl: './card-result-generic.component.html',
})
export class CardResultGenericComponent implements OnInit, OnDestroy {
  public isError$ = this.cardResultGenericService.getIsError();
  public isLoading$ = this.cardResultGenericService.getIsLoading();

  @Input() isLineDisposal = false;
  productsAttributesToDisplay: ProductInfosModel[] = [];

  private _httpProducts!: ResponseProducts;

  @Input() set httpProducts(httpProducts: ResponseProducts) {
    if (httpProducts !== undefined) {
      this._httpProducts = httpProducts;
      this.productsAttributesToDisplay =
        ProductUtils.setProductsInfoFromResponseProducts(httpProducts);
      if (this.productsAttributesToDisplay.length > 0) {
        this.searchFavorite(this.productsAttributesToDisplay);
      }
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
  subscription = new Subscription();

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  pageIndex?: number;
  loading = false;

  constructor(
    private readonly contextService: ContextService,
    private readonly cardResultGenericService: CardResultGenericService,
    private readonly favoriteSearchService: SearchFavoriteService,
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

  searchFavorite(productInfoModels: ProductInfosModel[]): void {
    this.subscription.add(
      this.contextService
        .isAuthenticated()
        .pipe(
          switchMap((isAuth) => {
            if (!isAuth) {
              return EMPTY;
            } else {
              const pageFavRequest: PageRequest<FavoriteModel> = {
                page: 0, // Page 1 is index 0 !!!!
                size: 24,
                sort: { property: 'dateCreation', order: 'desc' },
              };

              const favoriteFilterModel: FavoriteFilterModel = {
                productId: undefined,
                productsId: productInfoModels.map((pim) => pim.id!),
                name: undefined,
                nutriscore: undefined,
                ecoscore: undefined,
                novagroup: undefined,
                isEnabled: undefined,
                dateCreationEnd: undefined,
                dateCreationStart: undefined,
              };

              return this.favoriteSearchService
                .page(pageFavRequest, favoriteFilterModel)
                .pipe(
                  tap((res) => {
                    productInfoModels.forEach((pim) => {
                      const matchDefault = res.content.find(
                        (p) => p.productId === pim.id
                      );
                      if (matchDefault) {
                        pim.idFavorite = matchDefault.id;
                        pim.isFavorite = matchDefault.isEnabled;
                      }
                    });
                  })
                );
            }
          })
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
