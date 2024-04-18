import { Component, EventEmitter, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedDataSource } from '../../../shared/common/paginated-datasource';
import { TableGenericComponent } from '../../../shared/components/table-generic/table-generic.component';
import {
  EcoscoreGrade,
  NovagroupGrade,
  NutriscoreGrade,
} from '../../../shared/enum/score-grade.enum';
import {
  EcoscoreLinks,
  NovagroupLinks,
  NutriscoreLinks,
} from '../../../shared/enum/svg-urls.enum';
import { MaterialModule } from '../../../shared/material/material.module';
import { ProductInfosModel } from '../../../shared/model/product-attribute-displayed.model';
import { ResponseProducts } from '../../../shared/model/product.model';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../../shared/model/table-column-param.model';
import { ProductUtils } from '../../../shared/utils/product.utils';
import { UppercaseFirstLetterFormatPipe } from '../../../shared/pipes/uppercase-first-letter-format.pipe';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [TableGenericComponent, MaterialModule],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css',
})
export class ListProductComponent {
  public productsAttributesToDisplay: ProductInfosModel[] = [];

  private _httpProducts!: ResponseProducts;

  @Input() set httpProducts(httpProducts: ResponseProducts) {
    this._httpProducts = httpProducts;
    this.setProductsInfoFromResponseProducts();
    this.paginatedDataProducts.dataSource =
      new MatTableDataSource<ProductInfosModel>(
        this.productsAttributesToDisplay
      );

    this.paginatedDataProducts.count = this.httpProducts.count!;
    this.paginatedDataProducts.pageSize = this.httpProducts.page_size!;
    this.paginatedDataProducts.page =
      Number.parseInt(this.httpProducts.page!) - 1;
  }

  get httpProducts() {
    return this._httpProducts;
  }

  paginatedDataProducts = new PaginatedDataSource<ProductInfosModel>();
  eventPageIndexChange = new EventEmitter<Event>();

  columnParamsProductList: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Image',
      columDef: 'image',
      type: ColumnTypeParamEnum.IMAGE,
      isClickable: true,
    },
    { id: '2', label: 'Name', columDef: 'label' },
    {
      id: '3',
      label: 'Nutriscore',
      columDef: 'nutriscore',
      type: ColumnTypeParamEnum.IMAGE,
    },
    {
      id: '4',
      label: 'Ecoscore',
      columDef: 'ecoscore',
      type: ColumnTypeParamEnum.IMAGE,
    },
    {
      id: '5',
      label: 'Nova group',
      columDef: 'novagroup',
      type: ColumnTypeParamEnum.IMAGE,
    },
  ];

  constructor(
    private readonly uppercaseFristLetterPipe: UppercaseFirstLetterFormatPipe
  ) {}

  setProductsInfoFromResponseProducts(): void {
    if (this.httpProducts.products) {
      this.productsAttributesToDisplay = this.httpProducts.products.map(
        (productApi) =>
          ({
            id: productApi._id,
            image: productApi.image_small_url,
            label: this.uppercaseFristLetterPipe.transform(
              productApi.product_name!
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
