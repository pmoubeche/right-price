import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
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
import { CardResultGenericService } from '../../../shared/components/card-result-generic/card-result-generic.service';
import { MaterialModule } from '../../../shared/material/material.module';
import { Product, ResponseProducts } from '../../../shared/model/product.model';
import { NutriscoreUrlFromGradePipe } from '../../../shared/pipes/nutriscore-url-from-grade.pipe';
import { OpenFoodFactsApiService } from '../../../shared/services/openfoodfact-api.service';
import { ProductUtils } from '../../../shared/utils/product.utils';

export enum ChipParamSearch {
  BARCODE = 'Code barre',
  BRANDS = 'Marque',
  CATEGORY = 'Categorie',
  TERM = 'Terme',
}

@Component({
    selector: 'app-search-product-autocomplete',
    imports: [
        MaterialModule,
        ReactiveFormsModule,
        CommonModule,
        NutriscoreUrlFromGradePipe,
    ],
    templateUrl: './search-product-autocomplete.component.html',
    styleUrl: './search-product-autocomplete.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class SearchProductAutocompleteComponent implements OnInit, OnDestroy {
  readonly INPUT_TEXT: string = 'inputText';

  @Input() isLabelDisplayed = true;
  @Input() width?: number;
  @Input() isRedirectOnSelect = false;

  public searchForm?: FormGroup;

  private subscription: Subscription = new Subscription();

  public products$ = new Observable<Product[]>();
  public isLoading$ = this.cardResultService.getIsLoading();

  get textInputControl(): FormControl {
    return this.searchForm?.get(this.INPUT_TEXT) as FormControl;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly openFoodFactApiService: OpenFoodFactsApiService,
    private readonly cardResultService: CardResultGenericService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cardResultService.isErrorBs.next(false);
    this.setForm();
    this.defaultSearch();
    this.searchAutoComplete();
  }

  onSelectItem(product?: Product): void {
    if (this.isRedirectOnSelect) {
      this.router.navigate(['/product', product?.id]);
      this.cardResultService.productIdBs.next(product!.id!);
    } else {
      let productInfo = ProductUtils.setProductInfoFromProduct(product!);
      this.cardResultService.onSelectItem(productInfo!);
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

  searchAutoComplete(): void {
    this.cardResultService.loadingBs.next(true);
    this.cardResultService.isErrorBs.next(false);
    this.subscription.add(
      this.textInputControl?.valueChanges
        .pipe(
          debounceTime(500),
          switchMap((value) =>
            this.openFoodFactApiService.findProductsBySearchTerm(value).pipe(
              tap((response: ResponseProducts) => {
                this.products$ = of(response.products!);
                this.cardResultService.loadingBs.next(false);
              }),
              catchError(() => {
                this.cardResultService.isErrorBs.next(true);
                return of(EMPTY);
              })
            )
          )
        )
        .subscribe()
    );
  }

  defaultSearch(): void {
    this.cardResultService.loadingBs.next(true);
    this.cardResultService.isErrorBs.next(false);
    this.subscription.add(
      this.openFoodFactApiService
        .findProductsBySearchTerm(this.searchForm?.get(this.INPUT_TEXT)?.value)
        .pipe(
          tap((response: ResponseProducts) => {
            this.products$ = of(response.products!);
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
    this.defaultSearch();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
