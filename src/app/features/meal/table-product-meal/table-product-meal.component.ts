import { Component, Input } from '@angular/core';
import { PaginatedDataSource } from '../../../shared/common/paginated-datasource';
import { TableGenericComponent } from '../../../shared/components/table-generic/table-generic.component';
import { MaterialModule } from '../../../shared/material/material.module';
import {
  MealProductInfoModel,
  ProductInfosModel,
} from '../../../shared/model/product-attribute-displayed.model';
import { ResponseProduct } from '../../../shared/model/product.model';
import { MatTableDataSource } from '@angular/material/table';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../../shared/model/table-column-param.model';

@Component({
  selector: 'app-table-product-meal',
  standalone: true,
  imports: [MaterialModule, TableGenericComponent],
  templateUrl: './table-product-meal.component.html',
  styleUrl: './table-product-meal.component.scss',
})
export class TableProductMealComponent {
  isExpandedBreakfast = false;
  isExpandedLunch = false;
  isExpandedDinner = false;

  @Input() set mealProduct(mealProductInfoModel: MealProductInfoModel) {
    if (mealProductInfoModel.meal !== undefined) {
      this._mealProduct = mealProductInfoModel;
      this.addProductToRightList(mealProductInfoModel);
    }
  }

  _mealProduct?: MealProductInfoModel;

  get mealProduct() {
    return this._mealProduct!;
  }

  private mealProductsBreakfast: MealProductInfoModel[] = [];

  private mealProductsLunch: MealProductInfoModel[] = [];

  private mealProductsDinner: MealProductInfoModel[] = [];

  columnParamsMeal: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Aliment',
      columDef: 'image',
      type: ColumnTypeParamEnum.IMAGE,
      applyStyleWithImage: true,
    },
    {
      id: '2',
      label: 'Libellé',
      columDef: 'label',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '3',
      label: 'Nutriscore',
      columDef: 'nutriscore',
      type: ColumnTypeParamEnum.IMAGE,
      applyStyleWithImage: true,
    },
    {
      id: '4',
      label: 'Quantité',
      columDef: 'quantity',
      isEditable: true,
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '5',
      label: 'Actions',
      columDef: ColumnTypeParamEnum.ACTIONS,
      type: ColumnTypeParamEnum.ACTIONS,
    },
  ];

  dataSourceBreakfast = new PaginatedDataSource<MealProductInfoModel>();
  dataSourceLunch = new PaginatedDataSource<MealProductInfoModel>();
  dataSourceDinner = new PaginatedDataSource<MealProductInfoModel>();

  addProductToRightList(mealProduct: MealProductInfoModel): void {
    switch (mealProduct.meal) {
      case 'breakfast':
        this.mealProductsBreakfast.push(mealProduct);
        this.dataSourceBreakfast.dataSource =
          new MatTableDataSource<MealProductInfoModel>(
            this.mealProductsBreakfast
          );
        this.isExpandedBreakfast = true;
        break;
      case 'lunch':
        this.mealProductsLunch.push(mealProduct);
        this.dataSourceLunch.dataSource =
          new MatTableDataSource<MealProductInfoModel>(this.mealProductsLunch);
        this.isExpandedLunch = true;
        break;
      case 'dinner':
        this.mealProductsDinner.push(mealProduct);
        this.dataSourceDinner.dataSource =
          new MatTableDataSource<MealProductInfoModel>(this.mealProductsDinner);
        this.isExpandedDinner = true;
        break;
      default:
        break;
    }
  }
}
