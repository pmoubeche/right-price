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

  dataProducts = new MatTableDataSource<ProductInfosModel>();
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

  setProductsInfoFromResponseProducts(): void {
    if (this.httpProducts.products) {
      this.productsAttributesToDisplay = this.httpProducts.products.map(
        (productApi) =>
          ({
            id: productApi._id,
            image: productApi.image_small_url,
            label: productApi.abbreviated_product_name,
            nutriscore: this.getUrlNutriscore(productApi.nutriscore_grade!),
            ecoscore: this.getUrlEcoscore(productApi.ecoscore_grade!),
            novagroup: this.getUrlNovagroup(productApi.nova_group!),
          } as ProductInfosModel)
      );
    }
  }

  getUrlNutriscore(grade: string): string {
    switch (grade) {
      case NutriscoreGrade.A:
        return NutriscoreLinks.NUTRISCORE_A;
      case NutriscoreGrade.B:
        return NutriscoreLinks.NUTRISCORE_B;
      case NutriscoreGrade.C:
        return NutriscoreLinks.NUTRISCORE_C;
      case NutriscoreGrade.D:
        return NutriscoreLinks.NUTRISCORE_D;
      case NutriscoreGrade.E:
        return NutriscoreLinks.NUTRISCORE_E;
      case NutriscoreGrade.UNKNOWN:
        return NutriscoreLinks.NUTRISCORE_UNKNOWN;
      default:
        return NutriscoreLinks.NUTRISCORE_UNKNOWN;
    }
  }

  getUrlEcoscore(grade: string): string {
    switch (grade) {
      case EcoscoreGrade.A:
        return EcoscoreLinks.ECOSCORE_A;
      case EcoscoreGrade.B:
        return EcoscoreLinks.ECOSCORE_B;
      case EcoscoreGrade.C:
        return EcoscoreLinks.ECOSCORE_C;
      case EcoscoreGrade.D:
        return EcoscoreLinks.ECOSCORE_D;
      case EcoscoreGrade.UNKNOWN:
        return EcoscoreLinks.ECOSCORE_UNKNOWN;
      default:
        return EcoscoreLinks.ECOSCORE_UNKNOWN;
    }
  }

  getUrlNovagroup(grade: number): string {
    switch (grade) {
      case NovagroupGrade.GRADE_1:
        return NovagroupLinks.NOVAGROUP_1;
      case NovagroupGrade.GRADE_2:
        return NovagroupLinks.NOVAGROUP_2;
      case NovagroupGrade.GRADE_3:
        return NovagroupLinks.NOVAGROUP_3;
      case NovagroupGrade.GRADE_4:
        return NovagroupLinks.NOVAGROUP_4;
      case NovagroupGrade.UNKNOWN:
        return NovagroupLinks.NOVAGROUP_UNKNOWN;
      default:
        return NovagroupLinks.NOVAGROUP_UNKNOWN;
    }
  }
}
