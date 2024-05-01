import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MaterialModule } from '../../material/material.module';
import {
  Meal,
  MealProductInfoModel,
  ProductInfosModel,
} from '../../model/product-attribute-displayed.model';
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
  public meals: Meal[] = [
    { id: 'breakfast', label: "P'tit déj" },
    { id: 'lunch', label: 'Déjeuner' },
    { id: 'dinner', label: 'Dinner' },
  ];

  public mealSelected: Meal = new Meal();

  countProductPerLine = 6;
  productsAttributesToDisplay: ProductInfosModel[] = [];

  private _httpProducts!: ResponseProducts;

  @Input() set httpProducts(httpProducts: ResponseProducts) {
    if (httpProducts !== undefined) {
      this._httpProducts = httpProducts;
      this.setProductsInfoFromResponseProducts();
    }
  }

  get httpProducts() {
    return this._httpProducts;
  }

  public isSelectedCard?: boolean;
  selectedProductInfo?: ProductInfosModel;

  @Input() isPaginated = true;
  @Input() isClickable = false;
  @Input() isSelectableCard = true;
  @Input() pageSize? = 24;
  @Input() isSelectedForMeal = false;

  @Output() eventSelectProduct = new EventEmitter<MealProductInfoModel>();

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  pageIndex?: number;
  loading = false;

  constructor(
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

  onPageChange(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.cardResultGenericService.onPageChange(this.pageIndex, this.pageSize);
  }

  onSelectItem(productInfo?: ProductInfosModel): void {
    this.cardResultGenericService.onSelectItem(productInfo!);
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
