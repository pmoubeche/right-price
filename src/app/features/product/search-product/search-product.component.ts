import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, Subscription, catchError, of, tap } from 'rxjs';
import { CardResultGenericService } from '../../../shared/components/card-result-generic/card-result-generic.service';
import { MaterialModule } from '../../../shared/material/material.module';
import {
  ResponseProduct,
  ResponseProducts,
} from '../../../shared/model/product.model';
import { NutriscoreUrlFromGradePipe } from '../../../shared/pipes/nutriscore-url-from-grade.pipe';
import { OpenFoodFactsApiService } from '../../../shared/services/openfoodfact-api.service';

export enum ChipParamSearch {
  BARCODE = 'Code barre',
  BRANDS = 'Marque',
  CATEGORY = 'Categorie',
  TERM = 'Terme',
}

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.scss',
})
export class SearchProductComponent implements OnInit, OnDestroy {
  readonly INPUT_TEXT: string = 'inputText';
  readonly CHIP_OPTION: string = 'chipOption';

  @Input() public httpProduct: ResponseProduct = new ResponseProduct();
  @Input() public httpProducts: ResponseProducts = new ResponseProducts();
  @Input() pageSize?: number = 24;
  public pageIndex?: number;

  @Output() eventHttpProductsChange = new EventEmitter<ResponseProducts>();
  @Output() eventHttpProductChange = new EventEmitter<ResponseProduct>();

  productRes?: ResponseProduct;
  public chipList: string[] = Object.values(ChipParamSearch);
  public selectedChip?: string;
  public searchForm?: FormGroup;

  private subscription: Subscription = new Subscription();

  get textInputControl(): FormControl {
    return this.searchForm?.get(this.INPUT_TEXT) as FormControl;
  }
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly openFoodFactApiService: OpenFoodFactsApiService,
    private readonly cardResultService: CardResultGenericService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cardResultService.isErrorBs.next(false);
    this.setForm();
    this.switchPage();
    // this.selectFromCardList();
    this.searchFromFormField();
  }

  private searchFromFormField() {
    this.subscription.add(
      this.activatedRoute.queryParams
        .pipe(
          tap((params) => {
            if (Object.keys(params).length > 0) {
              this.textInputControl.setValue(params['search']);
            }
            this.search(this.pageIndex, this.pageSize);
          })
        )
        .subscribe()
    );
  }

  private selectFromCardList() {
    this.cardResultService.selectItem$.subscribe((item) => {
      this.searchById(item.id);
    });
  }

  /**
   * Init le search form for research
   */
  setForm(): void {
    this.searchForm = this.formBuilder.group({
      [this.INPUT_TEXT]: [''],
      [this.CHIP_OPTION]: [''],
    });
  }

  private switchPage(): void {
    this.cardResultService.onPageIndexChange$.subscribe((oPIBs) => {
      if (oPIBs.pageIndex >= 0 && oPIBs.pageSize) {
        this.pageIndex = oPIBs.pageIndex;
        this.search(oPIBs.pageIndex + 1, oPIBs.pageSize);
      } else if (oPIBs.pageIndex >= 0) {
        this.pageIndex = oPIBs.pageIndex;
        // page number is equal to page index +1
        this.search(oPIBs.pageIndex + 1);
      }
    });
  }

  search(pageIndex?: number, pageSize?: number): void {
    this.pageIndex = pageIndex;
    this.httpProduct = new ResponseProduct();
    this.httpProducts = new ResponseProducts();
    switch (this.searchForm?.get(this.CHIP_OPTION)?.value) {
      case ChipParamSearch.BARCODE:
        this.searchById(this.searchForm?.get(this.INPUT_TEXT)?.value);
        break;
      case ChipParamSearch.BRANDS:
        this.searchByBrand(pageIndex);
        break;
      case ChipParamSearch.CATEGORY:
        this.searchByCategory(pageIndex);
        break;
      case ChipParamSearch.TERM:
        this.searchByTerm(pageIndex, pageSize);
        break;
      default:
        this.searchByTerm(pageIndex, pageSize);
        break;
    }
  }

  searchById(barcode?: string): void {
    if (barcode) {
      this.router.navigate(['/product', barcode]);
    } else {
      this.subscription.add(
        this.openFoodFactApiService
          .findProductByBarCode(this.searchForm?.get(this.INPUT_TEXT)?.value)
          .pipe(
            tap((response: ResponseProduct) => {
              // this.router.navigate(['/product', response.product?._id]);
              this.httpProduct = response;
              this.eventHttpProductChange.emit(this.httpProduct);
            })
          )
          .subscribe()
      );
    }
  }

  searchByBrand(pageIndex?: number): void {
    this.subscription.add(
      this.setProductsFromApi(
        this.openFoodFactApiService.findProductsByBrand(
          this.searchForm?.get(this.INPUT_TEXT)?.value,
          pageIndex
        )
      )
    );
  }

  searchByCategory(pageIndex?: number): void {
    this.subscription.add(
      this.setProductsFromApi(
        this.openFoodFactApiService.findProductsByCategory(
          this.searchForm?.get(this.INPUT_TEXT)?.value,
          pageIndex
        )
      )
    );
  }

  searchByTerm(pageIndex?: number, pageSize?: number): void {
    this.subscription.add(
      this.setProductsFromApi(
        this.openFoodFactApiService.findProductsBySearchTerm(
          this.searchForm?.get(this.INPUT_TEXT)?.value,
          pageIndex,
          pageSize
        )
      )
    );
  }

  setProductsFromApi(apiEndpoint: Observable<ResponseProducts>): void {
    this.cardResultService.isErrorBs.next(false);
    this.cardResultService.loadingBs.next(true);
    this.cardResultService.textSearchedBs.next(this.textInputControl.value);
    apiEndpoint
      .pipe(
        tap((response: ResponseProducts) => {
          this.httpProducts = response;
          this.eventHttpProductsChange.emit(this.httpProducts);
          this.cardResultService.loadingBs.next(false);
        }),
        catchError(() => {
          this.cardResultService.isErrorBs.next(true);
          return of(EMPTY);
        })
      )
      .subscribe();
  }

  resetForm() {
    this.textInputControl.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
