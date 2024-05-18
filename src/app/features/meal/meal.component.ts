import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { CardResultGenericComponent } from '../../shared/components/card-result-generic/card-result-generic.component';
import { CardResultGenericService } from '../../shared/components/card-result-generic/card-result-generic.service';
import {
  ButtonAction,
  DialogContentModel,
} from '../../shared/components/dialog-generic/dialog-content.model';
import { DialogGenericComponent } from '../../shared/components/dialog-generic/dialog-generic.component';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../shared/components/dialog-generic/dialog-generic.service';
import { MaterialModule } from '../../shared/material/material.module';
import {
  Meal,
  MealProductInfoModel,
  MealProductParam,
  ProductInfosModel,
} from '../../shared/model/product-attribute-displayed.model';
import {
  ResponseProduct,
  ResponseProducts,
} from '../../shared/model/product.model';
import { MealProductApiService } from '../../shared/services/meal-product-api.service';
import { DateUtils } from '../../shared/utils/date.utils';
import { SearchProductComponent } from '../product/search-product/search-product.component';
import { ChartMealProductComponent } from './chart-meal-product/chart-meal-product.component';
import { MealService } from './meal.service';
import { TableProductMealComponent } from './table-product-meal/table-product-meal.component';

@Component({
  selector: 'app-meal',
  standalone: true,
  imports: [
    MaterialModule,
    TableProductMealComponent,
    ChartMealProductComponent,
    ReactiveFormsModule,
    SearchProductComponent,
    CardResultGenericComponent,
    DialogGenericComponent,
    CommonModule,
  ],
  templateUrl: './meal.component.html',
  styleUrl: './meal.component.scss',
})
export class MealComponent implements OnInit, OnDestroy {
  readonly DATE_MEAL_INPUT = 'dateMeal';
  readonly QUANTITY_FORM = 'quantity';
  readonly MEAL_FORM = 'meal';
  readonly PRODUCT_INFO_FORM = 'productInfo';

  private _mealProductsBreakfast!: MealProductInfoModel[];

  set mealProductsBreakfast(mealProductsBreakfast: MealProductInfoModel[]) {
    this._mealProductsBreakfast = mealProductsBreakfast;
  }

  get mealProductsBreakfast() {
    return this._mealProductsBreakfast;
  }

  private _mealProductsLunch!: MealProductInfoModel[];

  set mealProductsLunch(mealProductsLunch: MealProductInfoModel[]) {
    this._mealProductsLunch = mealProductsLunch;
  }

  get mealProductsLunch() {
    return this._mealProductsLunch;
  }

  private _mealProductsDinner!: MealProductInfoModel[];

  set mealProductsDinner(mealProductsDinner: MealProductInfoModel[]) {
    this._mealProductsDinner = mealProductsDinner;
  }

  get mealProductsDinner() {
    return this._mealProductsDinner;
  }

  public meals: Meal[] = [
    { id: 'breakfast', label: "P'tit déj" },
    { id: 'lunch', label: 'Déjeuner' },
    { id: 'dinner', label: 'Dinner' },
  ];

  private buttonsDialog: ButtonAction[] = [
    {
      isCloseButton: true,
      label: 'Fermer',
    },
  ];

  private dialogParamData: DialogContentModel = {
    title: 'Information',
    message:
      'Le produit selectionné est déjà renseigné dans un repas. Si tu souhaites ajuster sa quantité, modifie le directement dans le tableau correspondant',
    buttons: this.buttonsDialog,
  };

  mealSelected?: Meal;

  public httpProduct?: ResponseProduct;

  httpProducts!: ResponseProducts;

  mealProductForm!: FormGroup;

  public mealProduct: MealProductInfoModel = new MealProductInfoModel();

  public productInfoModelSelected?: ProductInfosModel;

  allMealsProduct: MealProductInfoModel[] = [];

  get quantityControl(): FormControl {
    return this.mealProductForm?.get(this.QUANTITY_FORM) as FormControl;
  }
  get mealControl(): FormControl {
    return this.mealProductForm?.get(this.MEAL_FORM) as FormControl;
  }

  get productInfoControl(): FormControl {
    return this.mealProductForm?.get(this.PRODUCT_INFO_FORM) as FormControl;
  }

  get dateControl(): FormControl {
    return this.mealProductForm?.get(this.DATE_MEAL_INPUT) as FormControl;
  }

  selectedDate?: string;

  subscription = new Subscription();

  @ViewChild('tableProductMealComponent')
  tableProductMealComponent!: TableProductMealComponent;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cardsService: CardResultGenericService,
    private readonly mealService: MealService,
    private readonly mealProductApiService: MealProductApiService,
    private readonly popInService: DialogGenericService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cardsService.selectItem$.subscribe((item) => {
      this.productInfoModelSelected = item;
    });
  }

  initForm(): void {
    this.mealProductForm = this.formBuilder.group({
      [this.DATE_MEAL_INPUT]: [new Date(), [Validators.required]],
      [this.QUANTITY_FORM]: ['', [Validators.required]],
      [this.MEAL_FORM]: new FormControl('', [Validators.required]),
      [this.PRODUCT_INFO_FORM]: [
        this.productInfoModelSelected,
        [Validators.required],
      ],
    });
  }

  onHttpProductsChange(httpProducts: ResponseProducts): void {
    this.httpProducts = httpProducts;
  }

  onHttpProductChange(httpProduct: ResponseProduct): void {
    this.httpProduct = httpProduct;
  }

  onSelectMeal(meal: any) {
    this.mealSelected = meal.value;
    this.productInfoControl.markAsTouched();
  }

  onDateChange(event: any) {
    this.mealService.dateSelectedBs.next(DateUtils.formatDate(event.value));
  }

  onMealProductsBreakfastChange(mealProducts: MealProductInfoModel[]): void {
    this.mealProductsBreakfast = mealProducts;
  }

  onMealProductsLunchChange(mealProducts: MealProductInfoModel[]): void {
    this.mealProductsLunch = mealProducts;
  }

  onMealProductsDinnerChange(mealProducts: MealProductInfoModel[]): void {
    this.mealProductsDinner = mealProducts;
  }

  addMealProductToResult(): void {
    let date = DateUtils.formatDate(this.dateControl.value);
    let quantity = this.quantityControl!.value;
    let meal = this.mealSelected;

    const mealProductParam: MealProductParam = {
      barcodeProduct: this.productInfoModelSelected?.id,
      nameProduct: this.productInfoModelSelected?.label,
      imageProduct: this.productInfoModelSelected?.image,
      nutriscore: this.productInfoModelSelected?.nutriscore,
      quantity: Number.parseFloat(quantity),
      mealType: meal?.id,
      date: date,
    };

    this.mealProductForm.markAllAsTouched();
    if (
      this.mealSelected &&
      this.quantityControl.valid &&
      this.productInfoModelSelected
    ) {
      if (this.isProductExistInList(mealProductParam)) {
        this.popInService.openDialog(
          CodeModaleEnum.INFORMATION,
          this.dialogParamData
        );
      } else {
        this.subscription.add(
          this.mealProductApiService
            .addMealProduct(mealProductParam)
            .pipe(
              tap((mealProductInfo) => {
                this.mealProduct = mealProductInfo;
                this.mealProduct.imageProduct =
                  this.productInfoModelSelected?.image;
                this.mealProduct.nutriscore =
                  this.productInfoModelSelected?.nutriscore;
              })
            )
            .subscribe()
        );
      }
    }
  }

  isProductExistInList(mealProductParam: MealProductParam): boolean {
    const allMealsProduct = [
      ...this.tableProductMealComponent.mealProductsBreakfast,
      ...this.tableProductMealComponent.mealProductsLunch,
      ...this.tableProductMealComponent.mealProductsDinner,
    ];
    return allMealsProduct.find(
      (mealProduct) =>
        mealProductParam.barcodeProduct === mealProduct.idProduct &&
        mealProductParam.mealType === mealProduct.mealType
    )?.idProduct
      ? true
      : false;
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
