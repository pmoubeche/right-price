import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  debounceTime,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { FavoriteFilterModel, FavoriteModel } from '../../../../generated';
import { PageRequest } from '../../../shared/common/paginated/page';
import { SearchFavoriteService } from '../../../shared/common/paginated/search-favorite.service';
import { CardResultGenericService } from '../../../shared/components/card-result-generic/card-result-generic.service';
import { MaterialModule } from '../../../shared/material/material.module';
import { ProductInfosModel } from '../../../shared/model/product-attribute-displayed.model';
import { OpenFoodFactsApiService } from '../../../shared/services/openfoodfact-api.service';

export enum ChipParamSearch {
  BARCODE = 'Code barre',
  BRANDS = 'Marque',
  CATEGORY = 'Categorie',
  TERM = 'Terme',
}

@Component({
  standalone: true,
  selector: 'app-search-product-autocomplete',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: './search-product-autocomplete.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class SearchProductAutocompleteComponent implements OnInit, OnDestroy {
  readonly INPUT_TEXT: string = 'inputText';
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  @Input() isLabelDisplayed = true;
  @Input() isRedirectOnSelect = false;

  public searchForm?: FormGroup;

  public isSearchFavorite = false;

  private subscription: Subscription = new Subscription();

  public productsInfos$ = new Observable<ProductInfosModel[]>();
  public productsInfos: ProductInfosModel[] = [];

  public isLoading$ = this.cardResultService.getIsLoading();
  indexNextPage: number = 2;
  prevPositionValue: number = 0;

  get textInputControl(): FormControl {
    return this.searchForm?.get(this.INPUT_TEXT) as FormControl;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly openFoodFactApiService: OpenFoodFactsApiService,
    private readonly cardResultService: CardResultGenericService,
    private readonly favoriteService: SearchFavoriteService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cardResultService.isErrorBs.next(false);
    this.setForm();
    this.defaultSearchOFF();
    this.searchAutoComplete();
  }

  setSearchFavoriteRequest(pageIndex: number): {
    pageRequest: PageRequest<FavoriteModel>;
    favoriteFilterModel: FavoriteFilterModel;
  } {
    return {
      pageRequest: {
        page: pageIndex, // Page 1 is index 0 !!!!
        size: 24,
        sort: { property: 'dateCreation', order: 'desc' },
      },
      favoriteFilterModel: {
        productId: undefined,
        productsId: undefined,
        name: this.textInputControl.value,
        nutriscore: undefined,
        ecoscore: undefined,
        novagroup: undefined,
        isEnabled: undefined,
        dateCreationStart: undefined,
        dateCreationEnd: undefined,
      },
    };
  }

  onSelectItem(product?: ProductInfosModel): void {
    if (this.isRedirectOnSelect) {
      this.router.navigate(['/product', product?.id]);
      this.cardResultService.productIdBs.next(product!.id!);
    } else {
      this.cardResultService.onSelectItem(product!);
    }
  }

  /**
   * Init le search form for research
   */
  setForm(): void {
    this.searchForm = this.formBuilder.group({
      [this.INPUT_TEXT]: [''],
    });
  }

  searchAutoComplete(indexPage?: number): void {
    this.cardResultService.loadingBs.next(true);
    this.cardResultService.isErrorBs.next(false);
    this.subscription.add(
      this.textInputControl?.valueChanges
        .pipe(
          debounceTime(500),
          switchMap((value) => {
            if (this.isSearchFavorite) {
              return this.favoriteService
                .page(
                  this.setSearchFavoriteRequest(indexPage!).pageRequest,
                  this.setSearchFavoriteRequest(indexPage!).favoriteFilterModel
                )
                .pipe(
                  tap((res) => {
                    this.productsInfos = [];
                    this.productsInfos.push(
                      ...res.content.map((fav) => {
                        return {
                          id: fav.productId,
                          idFavorite: fav.id,
                          isFavorite: fav.isEnabled,
                          label: fav.name,
                          image: fav.imageUrl,
                          nutriscore: fav.nutriscore,
                          ecoscore: fav.ecoscore,
                          novagroup: fav.novagroup,
                          dateCreation: fav.dateCreation,
                        } as ProductInfosModel;
                      })
                    );
                    this.productsInfos$ = of(this.productsInfos);
                    this.cardResultService.loadingBs.next(false);
                  }),
                  catchError(() => {
                    this.cardResultService.isErrorBs.next(true);
                    return of(EMPTY);
                  })
                );
            } else {
              return this.openFoodFactApiService
                .fromResponseProductsToProductInfos(
                  this.openFoodFactApiService.findProductsBySearchTerm(
                    value,
                    indexPage
                  )
                )
                .pipe(
                  tap((response) => {
                    this.productsInfos = [];
                    this.productsInfos = response!;
                    this.productsInfos$ = of(this.productsInfos);
                    this.cardResultService.loadingBs.next(false);
                  }),
                  catchError(() => {
                    this.cardResultService.isErrorBs.next(true);
                    this.cardResultService.loadingBs.next(false);
                    return of(EMPTY);
                  })
                );
            }
          })
        )
        .subscribe()
    );
  }

  searchWhenScrollBottom(indexPage?: number): void {
    this.cardResultService.loadingBs.next(true);
    this.cardResultService.isErrorBs.next(false);
    if (this.isSearchFavorite) {
      this.subscription.add(
        this.favoriteService
          .page(
            this.setSearchFavoriteRequest(indexPage! - 1).pageRequest,
            this.setSearchFavoriteRequest(indexPage! - 1).favoriteFilterModel
          )
          .pipe(
            tap((res) => {
              this.productsInfos.push(
                ...res.content.map((fav) => {
                  return {
                    id: fav.productId,
                    idFavorite: fav.id,
                    isFavorite: fav.isEnabled,
                    label: fav.name,
                    image: fav.imageUrl,
                    nutriscore: fav.nutriscore,
                    ecoscore: fav.ecoscore,
                    novagroup: fav.novagroup,
                    dateCreation: fav.dateCreation,
                  } as ProductInfosModel;
                })
              );
              this.productsInfos$ = of(this.productsInfos);
              this.cardResultService.loadingBs.next(false);
            }),
            catchError(() => {
              this.cardResultService.isErrorBs.next(true);
              return of(EMPTY);
            })
          )
          .subscribe()
      );
    } else {
      this.subscription.add(
        this.openFoodFactApiService
          .fromResponseProductsToProductInfos(
            this.openFoodFactApiService.findProductsBySearchTerm(
              this.searchForm?.get(this.INPUT_TEXT)?.value,
              indexPage
            )
          )
          .pipe(
            tap((response) => {
              // Feed this list for searchWhenScrollBottom
              this.productsInfos.push(...response);
              this.productsInfos$ = of(this.productsInfos);
              this.cardResultService.loadingBs.next(false);
            }),
            catchError(() => {
              this.cardResultService.isErrorBs.next(true);
              return of(EMPTY);
            })
          )
          .subscribe()
      );
    }
  }

  defaultSearchOFF(): void {
    const panel = this.matAutocomplete?.panel?.nativeElement;
    if (panel) {
      panel.scrollTop = 0;
    }
    this.cardResultService.loadingBs.next(true);
    this.cardResultService.isErrorBs.next(false);
    this.subscription.add(
      this.openFoodFactApiService
        .fromResponseProductsToProductInfos(
          this.openFoodFactApiService.findProductsBySearchTerm(
            this.searchForm?.get(this.INPUT_TEXT)?.value
          )
        )
        .pipe(
          tap((response) => {
            this.productsInfos = [];
            this.productsInfos.push(...response);
            this.productsInfos$ = of(this.productsInfos);
            this.cardResultService.loadingBs.next(false);
          }),
          catchError(() => {
            this.cardResultService.isErrorBs.next(true);
            return of(EMPTY);
          })
        )
        .subscribe()
    );
  }

  searchFavorite(pageIndex: number = 0): void {
    this.prevPositionValue = 0;
    this.indexNextPage = 2;
    if (!this.isSearchFavorite) {
      this.defaultSearchOFF();
    } else {
      this.getFavorites(pageIndex);
    }
  }

  private getFavorites(pageIndex: number) {
    const panel = this.matAutocomplete?.panel?.nativeElement;
    if (panel) {
      panel.scrollTop = 0;
    }

    this.cardResultService.loadingBs.next(true);
    this.cardResultService.isErrorBs.next(false);

    this.subscription.add(
      this.favoriteService
        .page(
          this.setSearchFavoriteRequest(pageIndex).pageRequest,
          this.setSearchFavoriteRequest(pageIndex).favoriteFilterModel
        )
        .pipe(
          tap((res) => {
            this.productsInfos = [];
            this.productsInfos.push(
              ...res.content.map((fav) => {
                return {
                  id: fav.productId,
                  idFavorite: fav.id,
                  isFavorite: fav.isEnabled,
                  label: fav.name,
                  image: fav.imageUrl,
                  nutriscore: fav.nutriscore,
                  ecoscore: fav.ecoscore,
                  novagroup: fav.novagroup,
                  dateCreation: fav.dateCreation,
                } as ProductInfosModel;
              })
            );
            this.productsInfos$ = of(this.productsInfos);
            this.cardResultService.loadingBs.next(false);
          }),
          catchError(() => {
            this.cardResultService.isErrorBs.next(true);
            return of(EMPTY);
          })
        )
        .subscribe()
    );
  }

  resetForm() {
    this.textInputControl.reset();
    this.indexNextPage = 2;
    this.prevPositionValue = 0;
    this.defaultSearchOFF();
    this.isSearchFavorite = false;
  }

  onAutocompleteOpened() {
    requestAnimationFrame(() => {
      const panel = this.matAutocomplete?.panel?.nativeElement;
      if (panel) {
        panel.addEventListener('scroll', () => this.onScroll(panel));
      }
    });
  }

  onScroll(panel: HTMLElement) {
    const threshold = 100;
    const position = panel.scrollTop + panel.clientHeight;
    const height = panel.scrollHeight;

    if (
      position + threshold >= height &&
      position - this.prevPositionValue > threshold
    ) {
      this.prevPositionValue = position;
      this.searchWhenScrollBottom(this.indexNextPage);
      this.indexNextPage++;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
