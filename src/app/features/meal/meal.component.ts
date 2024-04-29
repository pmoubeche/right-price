import { Component } from '@angular/core';
import { RapidSearchProductComponent } from './rapid-search-product/rapid-search-product.component';
import { SearchProductComponent } from '../product/search-product/search-product.component';
import { MealService } from './meal.service';
import { TableProductMealComponent } from './table-product-meal/table-product-meal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meal',
  standalone: true,
  imports: [
    MaterialModule,
    TableProductMealComponent,
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

  checkIfFormValid(): boolean {
    let date = this.dateControl;
    let quantity = this.quantityControl;
    let meal = this.mealSelected;

    if (date) {
    }
    return true;
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
      this.mealSelected ||
      this.quantityControl.valid ||
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
    const allMealsProduct: MealProductInfoModel[] = [
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

  private resetForm() {
    this.quantityControl.reset();
    this.mealControl.reset();
    this.productInfoControl.reset();
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
