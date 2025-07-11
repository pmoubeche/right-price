import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map, tap } from 'rxjs';
import { CardResultGenericService } from '../../shared/components/card-result-generic/card-result-generic.service';
import {
  ButtonAction,
  DialogContentModel,
} from '../../shared/components/dialogs/dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../shared/components/dialogs/dialog-generic.service';
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
import { SearchProductAutocompleteComponent } from '../product/search-product-autocomplete/search-product-autocomplete.component';
import { ChartMealProductComponent } from './chart-meal-product/chart-meal-product.component';
import { MealService } from './meal.service';
import { TableProductMealComponent } from './table-product-meal/table-product-meal.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CardProductComponent } from '../../shared/components/card-product/card-product.component';
import { MealModel, MealsService } from '../../../generated';

@Component({
  selector: 'app-meal',
  standalone: true,
  imports: [
    MaterialModule,
    TableProductMealComponent,
    ChartMealProductComponent,
    ReactiveFormsModule,
    CommonModule,
    SearchProductAutocompleteComponent,
    TablerIconsModule,
    CardProductComponent,
  ],
  templateUrl: './meal.component.html',
  styleUrl: './meal.component.scss',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MealComponent implements OnInit, OnDestroy {
  readonly DATE_MEAL_INPUT = 'dateMeal';
  readonly TIME_CREATE_MEAL_INPUT = 'timeCreateMeal';
  readonly MEAL_CREATE_CHIPS_SELECT = 'mealCreate';
  readonly TIME_EDIT_MEAL_INPUT = 'timeEditMeal';
  readonly MEAL_EDIT_CHIPS_SELECT = 'mealEdit';
  readonly MEAL_DELETE_SELECT_CHIP = 'mealDeleteSelect';

  readonly QUANTITY_FORM = 'quantity';
  readonly MEAL_ADD_PRODUCT_SELECT_CHIP = 'mealAddProductSelect';
  readonly PRODUCT_INFO_FORM = 'productInfo';

  public mealsDefault: Meal[] = [
    {
      id: 'breakfast',
      label: "P'tit déj",
      class: 'bg-light-success text-success',
      disabled: false,
    },
    {
      id: 'lunch',
      label: 'Déjeuner',

      class: 'bg-light-primary text-primary',
      disabled: false,
    },
    {
      id: 'dinner',
      label: 'Dinner',
      class: 'bg-light-warning text-warning',
      disabled: false,
    },
  ];

  public meals: Meal[] = [
    {
      id: 'breakfast',
      label: "P'tit déj",
      class: 'bg-light-success text-success',
      disabled: true,
    },
    {
      id: 'lunch',
      label: 'Déjeuner',

      class: 'bg-light-primary text-primary',
      disabled: true,
    },
    {
      id: 'dinner',
      label: 'Dinner',
      class: 'bg-light-warning text-warning',
      disabled: true,
    },
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

  private _mealProductsBreakfast!: MealProductInfoModel[];
  private _mealProductsLunch!: MealProductInfoModel[];
  private _mealProductsDinner!: MealProductInfoModel[];

  mealSelected?: Meal;
  allMealsSelected?: boolean;
  public httpProduct?: ResponseProduct;
  httpProducts!: ResponseProducts;
  mealCreateForm!: FormGroup;
  mealEditForm!: FormGroup;
  mealDeleteForm!: FormGroup;
  mealProductForm!: FormGroup;
  public mealProduct: MealProductInfoModel = new MealProductInfoModel();
  public productInfoModelSelected?: ProductInfosModel;
  allMealsProduct: MealProductInfoModel[] = [];
  timeCreate?: { hours: number; minutes: number };
  timeEdit?: { hours: number; minutes: number };
  selectedDate?: string;

  @ViewChild('tableProductMealComponent')
  tableProductMealComponent!: TableProductMealComponent;

  dates$: Observable<any> = this.activatedRoute.data.pipe(
    map((data) => data['dates'])
  );

  subscription = new Subscription();

  set mealProductsBreakfast(mealProductsBreakfast: MealProductInfoModel[]) {
    this._mealProductsBreakfast = mealProductsBreakfast;
    this.getMealChipsValue();
  }

  get mealProductsBreakfast() {
    return this._mealProductsBreakfast;
  }

  set mealProductsLunch(mealProductsLunch: MealProductInfoModel[]) {
    this._mealProductsLunch = mealProductsLunch;
    this.getMealChipsValue();
  }

  get mealProductsLunch() {
    return this._mealProductsLunch;
  }

  set mealProductsDinner(mealProductsDinner: MealProductInfoModel[]) {
    this._mealProductsDinner = mealProductsDinner;
    this.getMealChipsValue();
  }

  get mealProductsDinner() {
    return this._mealProductsDinner;
  }

  get mealCreateChipsControl(): FormControl {
    return this.mealCreateForm?.get(
      this.MEAL_CREATE_CHIPS_SELECT
    ) as FormControl;
  }
  get timeCreateMealControl(): FormControl {
    return this.mealCreateForm?.get(this.TIME_CREATE_MEAL_INPUT) as FormControl;
  }

  get mealEditChipsControl(): FormControl {
    return this.mealEditForm?.get(this.MEAL_EDIT_CHIPS_SELECT) as FormControl;
  }

  get timeEditMealControl(): FormControl {
    return this.mealEditForm?.get(this.TIME_EDIT_MEAL_INPUT) as FormControl;
  }

  get quantityControl(): FormControl {
    return this.mealProductForm?.get(this.QUANTITY_FORM) as FormControl;
  }

  get mealDeleteChipControl(): FormControl {
    return this.mealDeleteForm?.get(
      this.MEAL_DELETE_SELECT_CHIP
    ) as FormControl;
  }

  get mealAddProdcutChipControl(): FormControl {
    return this.mealProductForm?.get(
      this.MEAL_ADD_PRODUCT_SELECT_CHIP
    ) as FormControl;
  }

  get productInfoControl(): FormControl {
    return this.mealProductForm?.get(this.PRODUCT_INFO_FORM) as FormControl;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cardsService: CardResultGenericService,
    private readonly mealService: MealService,
    private readonly mealProductApiService: MealProductApiService,
    private readonly mealApiService: MealsService,
    private readonly popInService: DialogGenericService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedDate = DateUtils.formatDate(new Date());
    this.initForm();

    this.getMealsByDate();
    this.cardsService.selectItem$.subscribe((item) => {
      this.productInfoModelSelected = item;
    });

    this.setProductInfoSelectedFromProductDetail();
  }

  getMealChipsValue(): void {
    const mealProductsMap: { [key: string]: any[] | undefined } = {
      breakfast: this.mealProductsBreakfast,
      lunch: this.mealProductsLunch,
      dinner: this.mealProductsDinner,
    };

    this.meals = this.meals.map((meal) => ({
      ...meal,
      disabled: !(
        Array.isArray(mealProductsMap[meal.id!]) &&
        mealProductsMap[meal.id!]!.length > 0
      ),
    }));
  }

  getMealsByDate(): void {
    this.subscription.add(
      this.mealApiService
        .getMealsByDate(this.selectedDate!)
        .pipe(
          tap((meals) => {
            if (meals && meals.length > 0) {
              meals.forEach((meal) => {
                this.mealsDefault
                  .filter((md) => md.id === meal.id)
                  .map((m) => (m.disabled = true));
              });
            }
          })
        )
        .subscribe()
    );
  }

  private setProductInfoSelectedFromProductDetail() {
    this.subscription.add(
      this.mealService.productInfoModel$
        .pipe(
          tap((productInfo) => {
            this.productInfoModelSelected = productInfo;
          })
        )
        .subscribe()
    );
  }

  initForm(): void {
    this.mealCreateForm = this.formBuilder.group({
      [this.DATE_MEAL_INPUT]: [new Date(), [Validators.required]],
      [this.TIME_CREATE_MEAL_INPUT]: ['', [Validators.required]],
      [this.MEAL_DELETE_SELECT_CHIP]: ['', [Validators.required]],
      [this.MEAL_CREATE_CHIPS_SELECT]: ['', [Validators.required]],
    });
    this.mealEditForm = this.formBuilder.group({
      [this.TIME_EDIT_MEAL_INPUT]: ['', [Validators.required]],
      [this.MEAL_EDIT_CHIPS_SELECT]: ['', [Validators.required]],
    });
    this.mealDeleteForm = this.formBuilder.group({
      [this.MEAL_DELETE_SELECT_CHIP]: ['', [Validators.required]],
    });
    this.mealProductForm = this.formBuilder.group({
      [this.QUANTITY_FORM]: ['', [Validators.required]],
      [this.MEAL_ADD_PRODUCT_SELECT_CHIP]: ['', [Validators.required]],
      [this.PRODUCT_INFO_FORM]: [
        this.productInfoModelSelected,
        [Validators.required],
      ],
    });

    this.timeCreateMealControl.valueChanges.subscribe((timeCreate) => {
      this.timeCreate = {
        hours: timeCreate.getHours(),
        minutes: timeCreate.getMinutes(),
      };
    });

    this.timeEditMealControl.valueChanges.subscribe((timeEdit) => {
      this.timeEdit = {
        hours: timeEdit.getHours(),
        minutes: timeEdit.getMinutes(),
      };
    });
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let classApplied = '';
    this.dates$.subscribe((dates) => {
      const meDates = dates.map((date: any) => new Date(date));
      const index = meDates.findIndex(
        (x: any) =>
          new Date(x).toLocaleDateString() === date.toLocaleDateString()
      );
      if (index > -1) {
        if (meDates[index]) {
          classApplied = 'highlight-date';
        }
      }
      return classApplied;
    });
    return classApplied;
  };

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

  onDateChange(event: Date) {
    this.selectedDate = DateUtils.formatDate(event);
    this.mealService.dateSelectedBs.next(DateUtils.formatDate(event));
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

  addMeal(): void {
    this.meals = this.meals.map((meal) =>
      meal.id === this.mealCreateChipsControl.value.id
        ? {
            ...meal,
            disabled: false,
          }
        : meal
    );

    this.mealsDefault = this.mealsDefault.map((meal) =>
      meal.id === this.mealCreateChipsControl.value.id
        ? {
            ...meal,
            disabled: true,
          }
        : meal
    );

    const baseDate = DateUtils.parseDateFromString(this.selectedDate!);
    baseDate.setHours(
      this.timeCreate?.hours || 0,
      this.timeCreate?.minutes || 0
    );

    const req: MealModel = {
      mealType: this.mealCreateChipsControl.value.id,
      dateCreation: DateUtils.dateStringWithoutOffesetTimeZone(baseDate),
    };

    this.subscription.add(
      this.mealApiService
        .createMeal(req)
        .pipe(
          tap((mealCreated) => {
            this.mealCreateChipsControl.setValue('');
          })
        )
        .subscribe()
    );
  }

  deleteMeal(): void {
    this.meals = this.meals.map((meal) =>
      meal.id === this.mealDeleteChipControl.value.id
        ? {
            ...meal,
            disabled: true,
            timeHour: '',
            label: this.mealsDefault.find((md) => md.id === meal.id)?.label,
          }
        : meal
    );

    this.mealsDefault = this.mealsDefault.map((meal) =>
      meal.id === this.mealCreateChipsControl.value.id
        ? {
            ...meal,
            disabled: false,
          }
        : meal
    );

    this.mealDeleteChipControl.setValue('');

    this.subscription.add();
  }

  addMealProductToResult(): void {
    let time = DateUtils.fromTimeStringToMapTime(
      this.timeCreateMealControl.value
    );
    let quantity = this.quantityControl!.value;
    let meal = this.mealSelected;

    let myDate = new Date(this.selectedDate!).setHours(
      time.hours,
      time.minutes
    );

    const mealProductParam: MealProductParam = {
      barcodeProduct: this.productInfoModelSelected?.id,
      nameProduct: this.productInfoModelSelected?.label,
      imageProduct: this.productInfoModelSelected?.image,
      nutriscore: this.productInfoModelSelected?.nutriscore,
      quantity: Number.parseFloat(quantity),
      mealType: meal?.id,
      packagingQuantity: this.productInfoModelSelected?.packagingQuantity,
      date: DateUtils.dateStringWithoutOffesetTimeZone(new Date(myDate)),
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
