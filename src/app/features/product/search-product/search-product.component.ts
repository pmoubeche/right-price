import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
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
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  finalize,
  of,
  tap,
} from 'rxjs';
import { CardResultGenericService } from '../../../shared/components/card-result-generic/card-result-generic.service';
import { TableGenericService } from '../../../shared/components/table-generic/table-generic.service';
import { MaterialModule } from '../../../shared/material/material.module';
import {
  ResponseProduct,
  ResponseProducts,
} from '../../../shared/model/product.model';
import { OpenFoodFactsApiService } from '../../../shared/services/openfoodfact-api.service';

export enum ChipParamSearch {
  BARCODE = 'Barcode',
  BRANDS = 'Brands',
  CATEGORY = 'Category',
  TERM = 'Term',
}

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
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
    private readonly tableGenericService: TableGenericService,
    private readonly cardResultService: CardResultGenericService
  ) {}

  ngOnInit(): void {
    this.cardResultService.isErrorBs.next(false);
    this.setForm();
    this.switchPage();
    this.selectFromCardList();
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
        this.searchById();
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
    this.subscription.add(
      this.openFoodFactApiService
        .findProductByBarCode(
          barcode ? barcode : this.searchForm?.get(this.INPUT_TEXT)?.value
        )
        .pipe(
          tap((response: ResponseProduct) => {
            this.httpProduct = response;
            this.eventHttpProductChange.emit(this.httpProduct);
          })
        )
        .subscribe()
    );
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
    apiEndpoint
      .pipe(
        tap((response: ResponseProducts) => {
          this.cardResultService.isErrorBs.next(false);
          this.tableGenericService.loadingBs.next(true);
          this.httpProducts = response;
          this.eventHttpProductsChange.emit(this.httpProducts);
        }),
        catchError(() => {
          this.cardResultService.isErrorBs.next(true);
          return of(EMPTY);
        }),
        finalize(() => {
          this.tableGenericService.loadingBs.next(false);
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
