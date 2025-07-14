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
  ProductInfosModel,
} from '../../shared/model/product-attribute-displayed.model';
import {
  ResponseProduct,
  ResponseProducts,
} from '../../shared/model/product.model';
import { DateUtils } from '../../shared/utils/date.utils';
import { SearchProductAutocompleteComponent } from '../product/search-product-autocomplete/search-product-autocomplete.component';
import { ChartMealProductComponent } from './chart-meal-product/chart-meal-product.component';
import { MealService } from './meal.service';
import { TableProductMealComponent } from './table-product-meal/table-product-meal.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CardProductComponent } from '../../shared/components/card-product/card-product.component';
import {
  LProductMealService,
  MealModel,
  MealProductParam,
  MealsService,
  ProductMealInfoModel,
} from '../../../generated';

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
      mealType: 'breakfast',
      label: "P'tit déj",
      class: 'bg-light-success text-success',
      disabled: false,
    },
    {
      mealType: 'lunch',
      label: 'Déjeuner',

      class: 'bg-light-primary text-primary',
      disabled: false,
    },
    {
      mealType: 'dinner',
      label: 'Dinner',
      class: 'bg-light-warning text-warning',
      disabled: false,
    },
  ];

  public mealsCreate = this.mealsDefault;

  public meals: Meal[] = [
    {
      mealType: 'breakfast',
      label: "P'tit déj",
      class: 'bg-light-success text-success',
      disabled: true,
    },
    {
      mealType: 'lunch',
      label: 'Déjeuner',

      class: 'bg-light-primary text-primary',
      disabled: true,
    },
    {
      mealType: 'dinner',
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

  private _mealProductsBreakfast!: ProductMealInfoModel[];
  private _mealProductsLunch!: ProductMealInfoModel[];
  private _mealProductsDinner!: ProductMealInfoModel[];

  allMealsSelected?: boolean;
  public httpProduct?: ResponseProduct;
  httpProducts!: ResponseProducts;
  mealCreateForm!: FormGroup;
  mealEditForm!: FormGroup;
  mealDeleteForm!: FormGroup;
  mealProductForm!: FormGroup;
  public mealProduct?: ProductMealInfoModel;
  public productInfoModelSelected?: ProductInfosModel;
  allMealsProduct: ProductMealInfoModel[] = [];
  timeCreate?: { hours: number; minutes: number };
  timeEdit?: { hours: number; minutes: number };
  selectedDate?: string;
  selectedDateDate?: Date;
  //only for table-meal-prodcut updates
  selectedDeleteMeal?: MealModel;
  expandEdit = false;

  @ViewChild('tableProductMealComponent')
  tableProductMealComponent!: TableProductMealComponent;

  dates$: Observable<any> = this.activatedRoute.data.pipe(
    map((data) => data['dates'])
  );

  subscription = new Subscription();

  set mealProductsBreakfast(mealProductsBreakfast: ProductMealInfoModel[]) {
    this._mealProductsBreakfast = mealProductsBreakfast;
  }

  get mealProductsBreakfast() {
    return this._mealProductsBreakfast;
  }

  set mealProductsLunch(mealProductsLunch: ProductMealInfoModel[]) {
    this._mealProductsLunch = mealProductsLunch;
  }

  get mealProductsLunch() {
    return this._mealProductsLunch;
  }

  set mealProductsDinner(mealProductsDinner: ProductMealInfoModel[]) {
    this._mealProductsDinner = mealProductsDinner;
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
    private readonly lProductMealApiService: LProductMealService,
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

  getMealsByDate(): void {
    this.meals.forEach((meal) => {
      (meal.disabled = true), (meal.timeHour = '');
    });
    this.mealsCreate.forEach((meal) => (meal.disabled = false));

    this.subscription.add(
      this.mealApiService
        .getMealsByDate(this.selectedDate!)
        .pipe(
          tap((meals) => {
            if (meals && meals.length > 0) {
              meals.forEach((apiMeal) => {
                const matchDefault = this.mealsCreate.find(
                  (m) => m.mealType === apiMeal.mealType
                );
                if (matchDefault) {
                  matchDefault.disabled = true;
                }
                const matchMeal = this.meals.find(
                  (m) => m.mealType === apiMeal.mealType
                );
                if (matchMeal) {
                  matchMeal.disabled = false;
                  matchMeal.id = apiMeal.id;
                  matchMeal.timeHour = DateUtils.getHoursMinutesFromDateString(
                    apiMeal.dateCreation!
                  );
                }
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
      [this.PRODUCT_INFO_FORM]: [null, [Validators.required]],
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
          classApplied = 'highlight-date-success';
        }
      }
      return classApplied;
    });
    return classApplied;
  };

  onDateChange(event: Date) {
    this.selectedDate = DateUtils.formatDate(event);
    this.selectedDateDate = event;
    this.selectedDeleteMeal = {};
    this.getMealsByDate();
    this.mealService.dateSelectedBs.next(DateUtils.formatDate(event));
  }

  onMealProductsBreakfastChange(mealProducts: ProductMealInfoModel[]): void {
    this.mealProductsBreakfast = mealProducts;
  }

  onMealProductsLunchChange(mealProducts: ProductMealInfoModel[]): void {
    this.mealProductsLunch = mealProducts;
  }

  onMealProductsDinnerChange(mealProducts: ProductMealInfoModel[]): void {
    this.mealProductsDinner = mealProducts;
  }

  addMeal(): void {
    const baseDate = DateUtils.parseDateFromString(this.selectedDate!);
    baseDate.setHours(
      this.timeCreate?.hours || 0,
      this.timeCreate?.minutes || 0
    );

    const req: MealModel = {
      mealType: this.mealCreateChipsControl.value.mealType,
      dateCreation: DateUtils.dateStringWithoutOffesetTimeZone(baseDate),
    };

    this.subscription.add(
      this.mealApiService
        .createMeal(req)
        .pipe(
          tap((_) => {
            this.getMealsByDate();
            this.mealCreateChipsControl.reset();
            this.timeCreateMealControl.reset();
            this.timeCreateMealControl.untouched;
          })
        )
        .subscribe()
    );
  }

  editMeal(): void {
    const baseDate = DateUtils.parseDateFromString(this.selectedDate!);
    baseDate.setHours(this.timeEdit?.hours || 0, this.timeEdit?.minutes || 0);

    const req: MealModel = {
      id: this.mealEditChipsControl.value.id,
      mealType: this.mealEditChipsControl.value.mealType,
      dateCreation: DateUtils.dateStringWithoutOffesetTimeZone(baseDate),
    };

    this.subscription.add(
      this.mealApiService
        .updateMeal(req)
        .pipe(
          tap((_) => {
            this.getMealsByDate();
            this.mealEditChipsControl.reset();
            this.timeEditMealControl.reset();
            this.timeEditMealControl.untouched;
          })
        )
        .subscribe()
    );
  }

  openDeletePopIn(): void {
    const meals = [
      this.mealProductsBreakfast,
      this.mealProductsLunch,
      this.mealProductsDinner,
    ];

    const hasSelectedMealProductsInIt = meals.some(
      (mp) =>
        mp.length > 0 &&
        mp[0].mealType === this.mealDeleteChipControl.value.mealType
    );

    const messagePopIn =
      'En supprimant le repas, tous les aliments qui y sont contenus le seront également, continuer ?';

    if (hasSelectedMealProductsInIt) {
      this.popInService.openConfirmDialog('Attention', messagePopIn, () =>
        this.deleteMeal()
      );
    } else {
      this.deleteMeal();
    }
  }

  deleteMeal(): void {
    this.subscription.add(
      this.mealApiService
        .deleteMeal(this.mealDeleteChipControl.value.id)
        .pipe(
          tap((_) => {
            this.selectedDeleteMeal = this.mealDeleteChipControl.value;
            this.getMealsByDate();
            this.mealDeleteChipControl.reset();
          })
        )
        .subscribe()
    );
  }

  addMealProductToResult(): void {
    const mealProductParam: MealProductParam = {
      barcodeProduct: this.productInfoModelSelected?.id,
      nameProduct: this.productInfoModelSelected?.label,
      imageProduct: this.productInfoModelSelected?.image,
      nutriscore: this.productInfoModelSelected?.nutriscore,
      packagingQuantity: this.productInfoModelSelected?.packagingQuantity,
      quantity: Number.parseFloat(this.quantityControl!.value),
      mealId: this.mealAddProdcutChipControl?.value.id,
    };

    this.mealProductForm.markAllAsTouched();
    if (this.quantityControl.valid && this.productInfoModelSelected) {
      if (this.isProductExistInList(mealProductParam)) {
        this.popInService.openDialog(
          CodeModaleEnum.INFORMATION,
          this.dialogParamData
        );
      } else {
        this.subscription.add(
          this.lProductMealApiService
            .createProductOnMeal(mealProductParam)
            .pipe(
              tap((mealProductInfo) => {
                this.mealProduct = mealProductInfo;
                this.mealProduct.imageProduct =
                  this.productInfoModelSelected?.image;
                this.mealProduct.nutriscore =
                  this.productInfoModelSelected?.nutriscore;
                this.mealAddProdcutChipControl.reset();
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
        this.mealAddProdcutChipControl.value.mealType === mealProduct.mealType
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
