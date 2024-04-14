import { Component, Input, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import {
  Ingredient,
  Product,
  ResponseProduct,
} from '../../../shared/model/product.model';
import { TableGenericComponent } from '../../../shared/components/table-generic/table-generic.component';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../../shared/model/table-column-param.model';
import { PaginatedDataSource } from '../../../shared/common/paginated-datasource';
import { MatTableDataSource } from '@angular/material/table';

export class IngredientInfoModel {
  id?: string;
  ingredient?: string;
  percentage?: number;
}

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [MaterialModule, TableGenericComponent],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css',
})
export class DetailProductComponent implements OnInit {
  private _httpProduct!: ResponseProduct;
  public ingredients?: Ingredient[];
  public ingredientsInfo?: IngredientInfoModel[] = [];
  public product?: Product;

  @Input() set httpProduct(httpProduct: ResponseProduct) {
    this._httpProduct = httpProduct;
    this.product = httpProduct.product;
    this.setIngredientsInfoFromResponseProduct();
    this.ingredientDataSources.dataSource =
      new MatTableDataSource<IngredientInfoModel>(this.ingredientsInfo);
  }

  get httpProduct() {
    return this._httpProduct;
  }

  ingredientDataSources = new PaginatedDataSource<Ingredient>();

  columnParamsIngredients: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Ingredient',
      columDef: 'ingredient',
      type: ColumnTypeParamEnum.STRING,
      applyStyleWithImage: false,
    },
    {
      id: '2',
      label: 'Percentage',
      columDef: 'percentage',
      type: ColumnTypeParamEnum.STRING,
    },
  ];

  ngOnInit(): void {}

  setIngredientsInfoFromResponseProduct(): void {
    if (this.httpProduct.product) {
      this.ingredientsInfo = this.httpProduct.product.ingredients?.map(
        (ingredient) =>
          ({
            id: ingredient.id,
            ingredient: ingredient.text,
            percentage: ingredient.percent_estimate,
          } as IngredientInfoModel)
      );
    }
  }
}
