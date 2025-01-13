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
import { MealProductApiService } from '../../../shared/services/meal-product-api.service';
import { MealService } from '../meal.service';

@Component({
  selector: 'app-table-product-meal',
  standalone: true,
  imports: [MaterialModule, TableGenericComponent],
  templateUrl: './table-product-meal.component.html',
  styleUrl: './table-product-meal.component.scss',
})
export class TableProductMealComponent implements OnInit, OnDestroy {
  isExpandedBreakfast = false;
  isExpandedLunch = false;
  isExpandedDinner = false;

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

  columnParamsMeal: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Aliment',
      columDef: 'imageProduct',
      type: ColumnTypeParamEnum.IMAGE,
      applyStyleWithImage: true,
      colWidth: '6rem',
    },
    {
      id: '2',
      label: 'Libellé',
      columDef: 'labelProduct',
      isEditable: false,
      type: ColumnTypeParamEnum.STRING,
      colWidth: '6rem',
    },
    {
      id: '3',
      label: 'Nutriscore',
      columDef: 'nutriscore',
      type: ColumnTypeParamEnum.IMAGE,
      applyStyleWithImage: true,
      padding: '0 0 0 0',
    },
    {
      id: '4',
      label: 'Quantité (g)',
      columDef: 'quantity',
      type: ColumnTypeParamEnum.NUMBER,
      colWidth: '6rem',
      isEditable: true,
      padding: '0 0 0 1rem',
    },
    {
      id: '5',
      label: 'Actions',
      columDef: ColumnTypeParamEnum.ACTIONS,
      type: ColumnTypeParamEnum.ACTIONS,
      colWidth: '6rem',
    },
  ];

  dataSourceBreakfast = new PaginatedDataSource<MealProductInfoModel>();
  dataSourceLunch = new PaginatedDataSource<MealProductInfoModel>();
  dataSourceDinner = new PaginatedDataSource<MealProductInfoModel>();

  subscription = new Subscription();

  constructor(
    private readonly mealProductApiService: MealProductApiService,
    private readonly mealService: MealService,
    private readonly tableGenericService: TableGenericService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initDataMealsOnInitAndDateChange();
  }

  private initDataMealsOnInitAndDateChange() {
    this.subscription.add(
      this.mealService.dateSelected$
        .pipe(
          switchMap((selectedDate) =>
            this.mealProductApiService.getMealProducts(selectedDate).pipe(
              tap((mealProductInfosList) => {
                this.resetDatasOnChange();
                if (mealProductInfosList.length > 0) {
                  mealProductInfosList.forEach((productInfo) => {
                    this.addProductToRightList(productInfo);
                    productInfo.isEditable = false;
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
        this.isExpandedBreakfast = true;
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
        this.isExpandedLunch = true;
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
        this.isExpandedDinner = true;
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
          this.isExpandedBreakfast = false;
        }
        break;
      case 'lunch':
        this.mealProductsLunch = this.mealProductsLunch.filter(
          (mealProductFromList) =>
            mealProduct.idProduct !== mealProductFromList.idProduct
        );
        if (this.mealProductsLunch.length === 0) {
          this.isExpandedLunch = false;
        }
        break;
      case 'dinner':
        this.mealProductsDinner = this.mealProductsDinner.filter(
          (mealProductFromList) =>
            mealProduct.idProduct !== mealProductFromList.idProduct
        );
        if (this.mealProductsDinner.length === 0) {
          this.isExpandedDinner = false;
        }
        break;
      default:
        break;
    }
  }

  deleteLProductMeal(mealProductInfoParam: any): void {
    const param: MealProductInfoModel = mealProductInfoParam;
    this.subscription.add(
      this.mealProductApiService
        .deleteMealProduct(param.idLProductMeal!)
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
      this.mealProductApiService
        .updateMealProduct(mealProduct)
        .pipe(
          tap(() => {
            this.initDataMealsOnInitAndDateChange();
          })
        )
        .subscribe()
    );
  }

  onSelectLine(line: MealProductInfoModel): void {
    this.tableGenericService.onSelectItem(line.idProduct!);
    this.router.navigate([`/product`, line.idProduct!]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
