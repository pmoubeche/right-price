import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { PaginatedDataSource } from '../../../shared/common/paginated/paginated-datasource';
import { TableGenericComponent } from '../../../shared/components/table-generic/table-generic.component';
import { TableGenericService } from '../../../shared/components/table-generic/table-generic.service';
import { MaterialModule } from '../../../shared/material/material.module';
import { MealProductInfoModel } from '../../../shared/model/product-attribute-displayed.model';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../../shared/model/table-column-param.model';
import { MealService } from '../meal.service';
import { LProductMealService, MealModel } from '../../../../generated';
import { ButtonParam } from '../../../shared/model/button-param';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-table-product-meal',
  imports: [MaterialModule, TableGenericComponent, CommonModule],
  templateUrl: './table-product-meal.component.html',
})
export class TableProductMealComponent implements OnInit, OnDestroy {
  dateBreakfast?: string;
  dateLunch?: string;
  dateDinner?: string;

  dateSelected?: string;

  @Input() set mealProduct(mealProductInfoModel: MealProductInfoModel) {
    if (mealProductInfoModel.mealId !== undefined) {
      this._mealProduct = mealProductInfoModel;
      this.initDataMealsOnInitAndDateChange();
    }
  }

  _mealProduct?: MealProductInfoModel;

  get mealProduct() {
    return this._mealProduct!;
  }

  @Input() set meal(meal: MealModel) {
    this.initDataMealsOnInitAndDateChange();
  }

  _meal?: MealModel;

  get meal() {
    return this._meal!;
  }

  public mealProductsBreakfast: MealProductInfoModel[] = [];

  public mealProductsLunch: MealProductInfoModel[] = [];

  public mealProductsDinner: MealProductInfoModel[] = [];

  @Output() eventMealProductsBreakfast = new EventEmitter<
    MealProductInfoModel[]
  >();
  @Output() eventMealProductsLunch = new EventEmitter<MealProductInfoModel[]>();
  @Output() eventMealProductsDinner = new EventEmitter<
    MealProductInfoModel[]
  >();

  buttonsParams: ButtonParam[] = [
    {
      label: 'Modifier',
      icon: 'edit',
      color: 'success',
      isEditField: true,
    },
    {
      label: 'Supprimer',
      icon: 'trash-x',
      color: 'error',
      action: (row: any) => this.deleteLProductMeal(row),
    },
    {
      label: 'Voir',
      icon: 'eye',
      color: 'primary',
      action: (row: any) => this.viewProduct(row),
    },
  ];

  columnParamsMeal: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Aliment',
      columDef: 'imageProduct',
      type: ColumnTypeParamEnum.IMAGE,
      applyStyleWithImage: true,
      colWidth: '6rem',
      padding: '4px',
      sortable: false,
    },
    {
      id: '2',
      label: 'Libellé',
      columDef: 'labelProduct',
      isEditable: false,
      type: ColumnTypeParamEnum.STRING,
      colWidth: '6rem',
      padding: '4px',
    },
    {
      id: '3',
      label: 'Nutriscore',
      columDef: 'nutriscore',
      type: ColumnTypeParamEnum.IMAGE,
      applyStyleWithImage: true,
      padding: '4px',
    },
    {
      id: '4',
      label: 'Qté (g)',
      columDef: 'quantity',
      type: ColumnTypeParamEnum.NUMBER,
      colWidth: '6rem',
      isEditable: true,
      padding: '4px',
    },
    {
      id: '5',
      label: 'Actions',
      columDef: ColumnTypeParamEnum.ACTIONS,
      type: ColumnTypeParamEnum.ACTIONS,
      colWidth: '3rem',
      padding: '4px',
      sortable: false,
    },
  ];

  dataSourceBreakfast = new PaginatedDataSource<MealProductInfoModel>();
  dataSourceLunch = new PaginatedDataSource<MealProductInfoModel>();
  dataSourceDinner = new PaginatedDataSource<MealProductInfoModel>();

  subscription = new Subscription();

  constructor(
    private readonly lProductMealApiService: LProductMealService,
    private readonly mealService: MealService,
    private readonly tableGenericService: TableGenericService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initDataMealsOnInitAndDateChange();
  }

  private initDataMealsOnInitAndDateChange() {
    this.dateBreakfast = '';
    this.dateLunch = '';
    this.dateDinner = '';
    this.subscription.add(
      this.mealService.dateSelected$
        .pipe(
          switchMap((selectedDate) =>
            this.lProductMealApiService.getProductsOnMeal(selectedDate).pipe(
              tap((mealProductInfosList) => {
                this.resetDatasOnChange();
                if (mealProductInfosList.length > 0) {
                  mealProductInfosList.forEach((productInfo) => {
                    this.addProductToRightList(productInfo);
                    // productInfo.isEditable = false;
                  });
                }
                this.eventMealProductsBreakfast.emit(
                  this.mealProductsBreakfast
                );
                this.eventMealProductsLunch.emit(this.mealProductsLunch);
                this.eventMealProductsDinner.emit(this.mealProductsDinner);
              })
            )
          )
        )
        .subscribe()
    );
  }

  resetDatasOnChange() {
    this.mealProductsBreakfast = [];
    this.mealProductsLunch = [];
    this.mealProductsDinner = [];

    this.dataSourceBreakfast.dataSource =
      new MatTableDataSource<MealProductInfoModel>(this.mealProductsBreakfast);
    this.dataSourceLunch.dataSource =
      new MatTableDataSource<MealProductInfoModel>(this.mealProductsLunch);
    this.dataSourceDinner.dataSource =
      new MatTableDataSource<MealProductInfoModel>(this.mealProductsDinner);
  }

  addProductToRightList(mealProduct: MealProductInfoModel): void {
    let date = new Date(mealProduct.date!);
    switch (mealProduct.mealType) {
      case 'breakfast':
        this.mealProductsBreakfast.push(mealProduct);
        this.dataSourceBreakfast.dataSource =
          new MatTableDataSource<MealProductInfoModel>(
            this.mealProductsBreakfast
          );
        this.dateBreakfast = date
          .getUTCHours()
          .toString()
          .concat(':')
          .concat(
            date.getUTCMinutes() === 0 ? '00' : date.getUTCMinutes().toString()
          );
        break;
      case 'lunch':
        this.mealProductsLunch.push(mealProduct);
        this.dataSourceLunch.dataSource =
          new MatTableDataSource<MealProductInfoModel>(this.mealProductsLunch);
        this.dateLunch = date
          .getUTCHours()
          .toString()
          .concat(':')
          .concat(
            date.getUTCMinutes() === 0 ? '00' : date.getUTCMinutes().toString()
          );
        break;
      case 'dinner':
        this.mealProductsDinner.push(mealProduct);
        this.dataSourceDinner.dataSource =
          new MatTableDataSource<MealProductInfoModel>(this.mealProductsDinner);
        this.dateDinner = date
          .getUTCHours()
          .toString()
          .concat(':')
          .concat(
            date.getUTCMinutes() === 0 ? '00' : date.getUTCMinutes().toString()
          );
        break;
      default:
        break;
    }
  }

  deleteProductFromRightList(mealProduct: MealProductInfoModel): void {
    switch (mealProduct.mealType) {
      case 'breakfast':
        this.mealProductsBreakfast = this.mealProductsBreakfast.filter(
          (mealProductFromList) =>
            mealProduct.idProduct !== mealProductFromList.idProduct
        );
        if (this.mealProductsBreakfast.length === 0) {
        }
        break;
      case 'lunch':
        this.mealProductsLunch = this.mealProductsLunch.filter(
          (mealProductFromList) =>
            mealProduct.idProduct !== mealProductFromList.idProduct
        );
        if (this.mealProductsLunch.length === 0) {
        }
        break;
      case 'dinner':
        this.mealProductsDinner = this.mealProductsDinner.filter(
          (mealProductFromList) =>
            mealProduct.idProduct !== mealProductFromList.idProduct
        );
        if (this.mealProductsDinner.length === 0) {
        }
        break;
      default:
        break;
    }
  }

  deleteLProductMeal(mealProductInfoParam: any): void {
    const param: MealProductInfoModel = mealProductInfoParam;
    this.subscription.add(
      this.lProductMealApiService
        .deleteProductOnMeal(param.idLProductMeal!)
        .pipe(
          tap(() => {
            this.deleteProductFromRightList(param);
            this.initDataMealsOnInitAndDateChange();
          })
        )
        .subscribe()
    );
  }

  updateLProductMealQuantity(event: any): void {
    const mealProduct: MealProductInfoModel = event.element;
    const quantity: number = event.formInputValue;
    mealProduct.quantity = quantity;
    this.subscription.add(
      this.lProductMealApiService
        .updateProductOnMeal(mealProduct)
        .pipe(
          tap(() => {
            this.initDataMealsOnInitAndDateChange();
          })
        )
        .subscribe()
    );
  }

  viewProduct(line: any) {
    this.router.navigate([`/product`, line.idProduct!]);
  }

  onSelectLine(line: MealProductInfoModel): void {
    this.tableGenericService.onSelectItem(line.idProduct!);
    this.router.navigate([`/product`, line.idProduct!]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
