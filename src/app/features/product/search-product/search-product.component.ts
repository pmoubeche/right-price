import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subscription, tap } from 'rxjs';
import { MaterialModule } from '../../../shared/material/material.module';
import {
  Product,
  ResponseProduct,
  ResponseProducts,
} from '../../../shared/model/product.model';
import { OpenFoodFactsApiService } from '../../../shared/services/openfoodfact-api.service';
import { TableGenericService } from '../../../shared/components/table-generic/table-generic.service';

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
  styleUrl: './search-product.component.css',
})
export class SearchProductComponent implements OnInit, OnDestroy {
  readonly INPUT_TEXT: string = 'inputText';
  readonly CHIP_OPTION: string = 'chipOption';

  @Input() public product?: Product;
  @Input() public products: Product[] = [];
  @Input() public httpProducts: ResponseProducts = new ResponseProducts();

  @Output() eventProductsChange = new EventEmitter<Product[]>();
  @Output() eventHttpProductsChange = new EventEmitter<ResponseProducts>();

  productRes?: ResponseProduct;
  public chipList: string[] = Object.values(ChipParamSearch);
  public selectedChip?: string;
  public searchForm?: FormGroup;
  public pageIndex?: number;

  private subscription: Subscription = new Subscription();
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly openFoodFactApiService: OpenFoodFactsApiService,
    private readonly tableGenericService: TableGenericService
  ) {}

  ngOnInit(): void {
    this.setForm();
    this.switchPage();
  }

  /**
   * Init le search form for research
   */
  setForm(): void {
    this.searchForm = this.formBuilder.group({
      [this.INPUT_TEXT]: [''],
      [this.CHIP_OPTION]: [],
    });
  }

  private switchPage(): void {
    this.tableGenericService.onPageIndexChangeObs.subscribe((index) => {
      if (index >= 0) {
        this.pageIndex = index;
        // page number is equal to page index +1
        this.search(index + 1);
      }
    });
  }

  search(pageIndex?: number): void {
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
        this.searchByTerm(pageIndex);
        break;
      default:
        this.searchByTerm(pageIndex);
        break;
    }
  }

  searchById(): void {
    this.subscription.add(
      this.openFoodFactApiService
        .findProductByBarCode(this.searchForm?.get(this.INPUT_TEXT)?.value)
        .pipe(
          tap((response: ResponseProduct) => {
            this.product = response.product;
          })
          // catchError(() => {
          //   return of()
          // })
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

  searchByTerm(pageIndex?: number): void {
    this.subscription.add(
      this.setProductsFromApi(
        this.openFoodFactApiService.findProductsBySearchTerm(
          this.searchForm?.get(this.INPUT_TEXT)?.value,
          pageIndex
        )
      )
    );
  }

  setProductsFromApi(apiEndpoint: Observable<ResponseProducts>): void {
    apiEndpoint
      .pipe(
        tap((response: ResponseProducts) => {
          this.httpProducts = response;
          this.eventHttpProductsChange.emit(this.httpProducts);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
