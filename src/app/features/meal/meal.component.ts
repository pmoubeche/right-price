import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardResultGenericComponent } from '../../shared/components/card-result-generic/card-result-generic.component';
import { MaterialModule } from '../../shared/material/material.module';
import {
  Meal,
  MealProductInfoModel,
  ProductInfosModel,
} from '../../shared/model/product-attribute-displayed.model';
import {
  ResponseProduct,
  ResponseProducts,
} from '../../shared/model/product.model';
import { SearchProductComponent } from '../product/search-product/search-product.component';
import { RapidSearchProductComponent } from './rapid-search-product/rapid-search-product.component';
import { TableProductMealComponent } from './table-product-meal/table-product-meal.component';
import { OpenFoodFactsApiService } from '../../shared/services/openfoodfact-api.service';
import { Subscription, tap } from 'rxjs';
import { CardResultGenericService } from '../../shared/components/card-result-generic/card-result-generic.service';

@Component({
  selector: 'app-meal',
  standalone: true,
  imports: [
    MaterialModule,
    RapidSearchProductComponent,
    TableProductMealComponent,
    ReactiveFormsModule,
    SearchProductComponent,
    CardResultGenericComponent,
  ],
  templateUrl: './meal.component.html',
  styleUrl: './meal.component.scss',
})
export class MealComponent implements OnInit {
  readonly DATE_MEAL_INPUT = 'dateMeal';
  readonly QUANTITY_FORM = 'quantity';
  readonly MEAL_FORM = 'meal';
  readonly PRODUCT_INFO_FORM = 'productInfo';

  public meals: Meal[] = [
    { id: 'breakfast', label: "P'tit déj" },
    { id: 'lunch', label: 'Déjeuner' },
    { id: 'dinner', label: 'Dinner' },
  ];

  mealSelected?: Meal;

  public httpProduct?: ResponseProduct;

  httpProducts!: ResponseProducts;

  mealProductForm!: FormGroup;

  public mealProduct: MealProductInfoModel = new MealProductInfoModel();

  public productInfoModelSelected?: ProductInfosModel;

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

  subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cardsService: CardResultGenericService
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
      [this.QUANTITY_FORM]: [''],
      [this.MEAL_FORM]: [new Meal()],
      [this.PRODUCT_INFO_FORM]: [this.productInfoModelSelected],
    });
  }

  onHttpProductsChange(httpProducts: ResponseProducts): void {
    this.httpProducts = httpProducts;
  }

  onHttpProductChange(httpProduct: ResponseProduct): void {
    this.httpProduct = httpProduct;
  }

  onSelectProduct(productInfo: ProductInfosModel) {
    this.productInfoModelSelected = productInfo;
  }

  onSelectMeal(meal: any) {
    this.mealSelected = meal.value;
  }

  addMealProductToResult(): void {
    let date = this.mealProductForm?.get(this.DATE_MEAL_INPUT)!.value;
    let quantity = this.mealProductForm?.get(this.QUANTITY_FORM)!.value;
    let meal = this.mealSelected;
    // let product = this.mealProductForm?.get(this.PRODUCT_INFO_FORM)!.value;

    this.mealProduct = {
      id: this.productInfoModelSelected!.id,
      label: this.productInfoModelSelected!.label,
      image: this.productInfoModelSelected!.image,
      nutriscore: this.productInfoModelSelected!.nutriscore,
      quantity: quantity,
      meal: meal!.id,
      date: date,
    };
    this.resetForm();
  }

  private resetForm() {
    this.quantityControl.reset();
    this.mealControl.reset();
    this.productInfoControl.reset();
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
}
