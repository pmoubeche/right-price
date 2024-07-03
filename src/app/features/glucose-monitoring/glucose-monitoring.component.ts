import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import 'chartjs-adapter-moment';
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { CgmImportService, CgmInfoModel } from '../../../generated';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { ChartUtils } from '../../shared/components/chart/chart.utils';
import { MaterialModule } from '../../shared/material/material.module';
import { CodeLabelModel } from '../../shared/model/code-label.model';
import { DateUtils } from '../../shared/utils/date.utils';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { MealProductApiService } from '../../shared/services/meal-product-api.service';
import { OpenFoodFactsApiService } from '../../shared/services/openfoodfact-api.service';
import { MealProductInfoModel } from '../../shared/model/product-attribute-displayed.model';
import {
  Nutriments,
  Product,
  ResponseProducts,
} from '../../shared/model/product.model';
import { ProductUtils } from '../../shared/utils/product.utils';
import { TableGenericComponent } from '../../shared/components/table-generic/table-generic.component';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../shared/model/table-column-param.model';
import { PaginatedDataSource } from '../../shared/common/paginated/paginated-datasource';
import { MatTableDataSource } from '@angular/material/table';
import { RoundNumberDecimalPipe } from '../../shared/pipes/round-number-decimal.pipe';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../shared/components/dialogs/dialog-generic.service';

export class CarbsAndSugarsValuesCharts {
  mealType!: string;
  dateTime!: number;
  sumCarbs!: number;
  sumSugars!: number;
}

@Component({
  selector: 'app-glucose-monitoring',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ChartComponent,
    TableGenericComponent,
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
  ],
  templateUrl: './glucose-monitoring.component.html',
  styleUrl: './glucose-monitoring.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GlucoseMonitoringComponent implements OnInit, OnDestroy {
  readonly DEVICE_FIELD = 'device';
  public deviceOptions: CodeLabelModel[] = [
    { code: 'dexcom', label: 'Dexcom' },
  ];

  datesMeals$: Observable<any> = this.activatedRoute.data.pipe(
    map((data) => data['datesMeals'])
  );

  datesCgms$: Observable<any> = this.activatedRoute.data.pipe(
    map((data) => data['datesCgm'])
  );

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
      padding: '0 0 0 1rem',
    },
  ];

  dataSourceBreakfast = new PaginatedDataSource<MealProductInfoModel>();
  dataSourceLunch = new PaginatedDataSource<MealProductInfoModel>();
  dataSourceDinner = new PaginatedDataSource<MealProductInfoModel>();

  nutrimentsBreakfast: Nutriments = new Nutriments();
  nutrimentsLunch: Nutriments = new Nutriments();
  nutrimentsDinner: Nutriments = new Nutriments();

  public mealProductsBreakfast: MealProductInfoModel[] = [];

  public mealProductsLunch: MealProductInfoModel[] = [];

  public mealProductsDinner: MealProductInfoModel[] = [];

  optionsBarMeal: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
      },
      y: { stacked: true, position: 'right' },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  optionsCgmChart: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          displayFormats: {
            minute: 'HH:mm',
          },
          tooltipFormat: 'HH:mm',
        },
        title: {
          display: true,
          text: 'Temps',
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Glycémie (mg/dL)',
        },
      },
      y1: {
        type: 'linear',
        // display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Quantité (g)',
        },
        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  };
  cgmChartLineData?: ChartData;

  public selectedDate!: Date | null;
  public deviceSelected!: string;
  public deviceForm!: FormGroup;

  private cgmInfos: CgmInfoModel[] = [];

  public isMaleReco = true;

  private carbsAndSugarsValuesCharts: CarbsAndSugarsValuesCharts[] = [];

  dailyRecommanderIncomeChartsBarDataBreakfast?: ChartData[] = [];
  dailyRecommanderIncomeChartsBarDataLunch?: ChartData[] = [];
  dailyRecommanderIncomeChartsBarDataDinner?: ChartData[] = [];

  public fileSelected!: File;
  private subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cgmImportServiceApi: CgmImportService,
    private readonly mealService: MealProductApiService,
    private readonly openFoodFactApi: OpenFoodFactsApiService,
    private readonly snackbarService: SnackbarService,
    private readonly roundNumberPipe: RoundNumberDecimalPipe,
    private readonly dialogService: DialogGenericService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    ChartUtils.setChartImports();
    this.initForm();
  }

  private initForm(): void {
    this.deviceForm = this.formBuilder.group({
      [this.DEVICE_FIELD]: ['', [Validators.required]],
    });
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let classApplied = '';

    this.subscription.add(
      combineLatest([this.datesMeals$, this.datesCgms$])
        .pipe(
          tap(([datesMeals, datesCgms]) => {
            const mealsDates: Date[] = datesMeals.map(
              (date: any) => new Date(date)
            );
            const cgmDates: Date[] = datesCgms.map(
              (date: any) => new Date(date)
            );
            const indexMeals = mealsDates.findIndex(
              (x: any) =>
                new Date(x).toLocaleDateString() === date.toLocaleDateString()
            );
            const indexCgm = cgmDates.findIndex(
              (x: any) =>
                new Date(x).toLocaleDateString() === date.toLocaleDateString()
            );

            if (indexMeals > -1) {
              if (mealsDates[indexMeals]) {
                classApplied = 'highlight-date-meals';
              }
            }

            if (indexCgm > -1) {
              if (cgmDates[indexCgm]) {
                classApplied = 'highlight-date-cgm';
              }
            }

            if (indexMeals > -1 && indexCgm > -1) {
              if (
                mealsDates[indexMeals].getDay() === cgmDates[indexCgm].getDay()
              ) {
                classApplied = 'highlight-date-cgm-and-meals';
              }
            }
            return classApplied;
          })
        )
        .subscribe()
    );

    return classApplied;
  };

  onSelectedDate(date: Date): void {
    this.resetDatasOnChange();
    this.getCgmData(date);
    this.getMealProductsInfos(date);
  }

  private resetDatasOnChange() {
    this.carbsAndSugarsValuesCharts = [];
    this.dailyRecommanderIncomeChartsBarDataBreakfast = [];
    this.dailyRecommanderIncomeChartsBarDataLunch = [];
    this.dailyRecommanderIncomeChartsBarDataDinner = [];
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

  getCgmData(date: Date): void {
    this.subscription.add(
      this.cgmImportServiceApi
        .getCgmByDateAndUser(DateUtils.formatDate(date))
        .pipe(
          tap((res) => {
            this.cgmInfos = res;
            this.setChartCgmData(res);
          })
        )
        .subscribe()
    );
  }

  getMealProductsInfos(date: Date): void {
    this.subscription.add(
      this.mealService
        .getMealProducts(DateUtils.formatDate(date))
        .pipe(
          tap((mealProductsInfos) => {
            if (mealProductsInfos.length > 0) {
              this.getHttpProductsFromOFF(mealProductsInfos);
              mealProductsInfos.forEach((productInfo) => {
                this.addProductToRightList(productInfo);
                productInfo.isEditable = false;
              });
            }
          })
        )
        .subscribe()
    );
  }

  getHttpProductsFromOFF(mealProductsInfos: MealProductInfoModel[]): void {
    const barcodes = mealProductsInfos.map((info) => info.idProduct!);
    this.subscription.add(
      this.openFoodFactApi
        .findProductsByBarcodes(barcodes)
        .pipe(
          tap((httpProducts) => {
            this.setCarbMapForBarChart(
              mealProductsInfos,
              httpProducts,
              'breakfast'
            );
            this.setCarbMapForBarChart(
              mealProductsInfos,
              httpProducts,
              'lunch'
            );
            this.setCarbMapForBarChart(
              mealProductsInfos,
              httpProducts,
              'dinner'
            );

            this.setChartCgmData(this.cgmInfos);
            this.setNutrimentsMeal(
              httpProducts,
              mealProductsInfos,
              'breakfast'
            );
            this.setNutrimentsMeal(httpProducts, mealProductsInfos, 'lunch');
            this.setNutrimentsMeal(httpProducts, mealProductsInfos, 'dinner');
          })
        )
        .subscribe()
    );
  }

  setNutrimentsMeal(
    httpProducts: ResponseProducts,
    mealProducts: MealProductInfoModel[],
    mealType: 'breakfast' | 'lunch' | 'dinner'
  ) {
    const nutrimentList = [
      'energy-kj_100g',
      'energy-kcal_100g',
      'carbohydrates_100g',
      'sugars_100g',
      'proteins_100g',
      'fat_100g',
      'saturated-fat_100g',
      'fiber_100g',
      'salt_100g',
    ];

    let nutriments: Nutriments = new Nutriments();

    if (httpProducts.products?.length! > 0) {
      httpProducts.products?.forEach((product) => {
        product!.nutriments =
          ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(product!);
      });

      nutrimentList.forEach((nutAttr) => {
        let attr = nutAttr as keyof typeof Nutriments;
        //@ts-ignore
        nutriments[attr] = this.sumNutrimentsInMeal(
          nutAttr,
          httpProducts.products!,
          mealProducts,
          mealType
        );
      });

      this.setNutrimentToNutrimentList(mealType, nutriments);
      this.setNutrimentsChartsBarsDataBreakfast(this.nutrimentsBreakfast);
      this.setNutrimentsChartsBarsDataLunch(this.nutrimentsLunch);
      this.setNutrimentsChartsBarsDataDinner(this.nutrimentsDinner);
    }
  }

  sumNutrimentsInMeal(
    labelNutriment: string,
    listProduct: Product[],
    mealProducts: MealProductInfoModel[],
    mealType: 'breakfast' | 'lunch' | 'dinner'
  ): number {
    if (mealProducts.length === 0) {
      return 0;
    }

    let sum = 0;

    mealProducts
      .filter((mealP) => mealP.mealType === mealType)
      .forEach((mealProduct) => {
        let product = listProduct.find(
          (product) => mealProduct.idProduct === product.id
        )!;
        type ObjectKey = keyof typeof product.nutriments;
        const attr = labelNutriment as ObjectKey;
        sum += product.nutriments![attr] * (mealProduct?.quantity! / 100);
      });

    return this.roundNumberPipe.transform(sum, 2);
  }

  private setNutrimentToNutrimentList(
    mealType: string,
    nutriments: Nutriments
  ) {
    switch (mealType) {
      case 'breakfast':
        this.nutrimentsBreakfast = nutriments;
        break;
      case 'lunch':
        this.nutrimentsLunch = nutriments;
        break;
      case 'dinner':
        this.nutrimentsDinner = nutriments;
        break;
      default:
        break;
    }
  }

  addProductToRightList(mealProduct: MealProductInfoModel): void {
    switch (mealProduct.mealType) {
      case 'breakfast':
        this.mealProductsBreakfast.push(mealProduct);
        this.dataSourceBreakfast.dataSource =
          new MatTableDataSource<MealProductInfoModel>(
            this.mealProductsBreakfast
          );
        break;
      case 'lunch':
        this.mealProductsLunch.push(mealProduct);
        this.dataSourceLunch.dataSource =
          new MatTableDataSource<MealProductInfoModel>(this.mealProductsLunch);
        break;
      case 'dinner':
        this.mealProductsDinner.push(mealProduct);
        this.dataSourceDinner.dataSource =
          new MatTableDataSource<MealProductInfoModel>(this.mealProductsDinner);
        break;
      default:
        break;
    }
  }

  setCarbMapForBarChart(
    mealProductInfos: MealProductInfoModel[],
    httpProducts: ResponseProducts,
    mealType: 'breakfast' | 'lunch' | 'dinner'
  ): void {
    if (mealProductInfos.length > 0) {
      const mealProductInfo = mealProductInfos.filter(
        (mealProduct) => mealProduct.mealType === mealType
      );
      const productsFromOFF = httpProducts.products?.filter((productHttp) =>
        mealProductInfo.map((mpi) => mpi.idProduct).includes(productHttp.id!)
      );
      let sumCarbs: number = 0;
      let sumSugars: number = 0;

      mealProductInfo.forEach((mealProduct) => {
        const productOFF = productsFromOFF?.find(
          (prodOFF) => mealProduct.idProduct === prodOFF.id
        );
        productOFF!.nutriments =
          ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(productOFF!);
        sumCarbs +=
          (productOFF?.nutriments!['carbohydrates_100g']! *
            mealProduct.quantity!) /
          100;
        sumSugars +=
          (productOFF?.nutriments!['sugars_100g']! * mealProduct.quantity!) /
          100;
      });
      this.carbsAndSugarsValuesCharts.push({
        mealType: mealType,
        dateTime: new Date(mealProductInfo[0].date!).getTime(),
        sumCarbs: sumCarbs,
        sumSugars: sumSugars,
      });
    }
  }

  onSelectDevice(device: any) {
    this.deviceSelected = device.value;
    this.deviceForm.markAsTouched();
  }

  uploadCsvFile(event: any): void {
    this.fileSelected = event.target.files[0];

    this.subscription.add(
      this.cgmImportServiceApi
        .existDataInDbFromCsv(this.fileSelected)
        .pipe(
          switchMap((res) =>
            res
              ? of(true).pipe(
                  tap(() =>
                    this.dialogService.openDialog(CodeModaleEnum.CSV_IMPORT, [
                      this.fileSelected,
                      this.deviceSelected,
                    ])
                  )
                )
              : this.cgmImportServiceApi
                  .importGgmFromOrigin(this.deviceSelected, this.fileSelected)
                  .pipe(
                    tap(() => {
                      this.snackbarService.show(
                        'Import de données effectué avec succès'
                      );
                    }),
                    catchError(() => {
                      this.snackbarService.show(
                        "Une erreur est survenue lors de l'import"
                      );
                      return EMPTY;
                    })
                  )
          )
        )
        .subscribe()
    );
  }

  setChartCgmData(datasCgm: CgmInfoModel[]): void {
    const datasChartLine = datasCgm.map((data) => {
      return {
        x: new Date(data.dateTimestamp).getTime(),
        y: data.glucoseValue,
      };
    });

    let mealCarbList: number[] = [];
    let arrayDateTimes: number[] = [];
    if (this.carbsAndSugarsValuesCharts.length > 0) {
      // Add the meal date times to the x axe and sort it asc
      arrayDateTimes = datasChartLine
        .map((el) => el.x)
        .concat(this.carbsAndSugarsValuesCharts.map((el) => el.dateTime))
        .sort();

      // Look for indexes where meals datetimes have been inserted
      const indexMealBreakfastDateTime = arrayDateTimes.indexOf(
        this.carbsAndSugarsValuesCharts[0].dateTime
      );
      const indexMealLunchDateTime = arrayDateTimes.indexOf(
        this.carbsAndSugarsValuesCharts[1].dateTime
      );
      const indexMealDinnerDateTime = arrayDateTimes.indexOf(
        this.carbsAndSugarsValuesCharts[2].dateTime
      );

      // Create a new list filled with 0s and replace the indexes values by current meal intake value to match timeline
      mealCarbList = Array(arrayDateTimes.length).fill(0);

      mealCarbList[indexMealBreakfastDateTime] =
        this.carbsAndSugarsValuesCharts[0].sumCarbs;
      mealCarbList[indexMealLunchDateTime] =
        this.carbsAndSugarsValuesCharts[1].sumCarbs;
      mealCarbList[indexMealDinnerDateTime] =
        this.carbsAndSugarsValuesCharts[2].sumCarbs;
    }

    this.cgmChartLineData = {
      labels:
        this.carbsAndSugarsValuesCharts.length > 0
          ? arrayDateTimes
          : datasChartLine.map((el) => el.x),
      datasets: [
        {
          label: 'Glucides (g)',
          type: 'bar',
          data: this.carbsAndSugarsValuesCharts.length > 0 ? mealCarbList : [],
          backgroundColor: ['#2b5fad'],
          borderColor: ['#2b5fad'],
          yAxisID: 'y1',
          order: 2,
          barThickness: 10,
          borderRadius: 5,
        },
        {
          label: 'Glycémie journalière en mg/dL',
          type: 'line',
          data: datasChartLine.map((el) => el.y),
          backgroundColor: ['#7fc8c9'],
          borderColor: ['#7fc8c9'],
          yAxisID: 'y',
          order: 1,
        },
      ],
    };
  }

  setNutrimentsChartsBarsDataBreakfast(nutriments: Nutriments): void {
    this.dailyRecommanderIncomeChartsBarDataBreakfast = [];
    let nutrimentChartMapBreakfast =
      ProductUtils.setNutrimentChartBarMap(nutriments);

    nutrimentChartMapBreakfast.forEach((value: number, key: string) => {
      const dataSetBreakfast: ChartDataset = {
        label: "P'tit déj",
        data: [value],
        fill: true,
        backgroundColor: ['#7fc8c9'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
      };

      const dataSetFiller: ChartDataset = {
        label: 'AJR',
        data: [
          ChartUtils.setValueFiller(this.isMaleReco, key, dataSetBreakfast),
        ],
        fill: true,
        backgroundColor: ['#f1f1f1'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
      };

      const chartData: ChartData = {
        labels: [key],
        datasets: [dataSetBreakfast, dataSetFiller],
      };
      this.dailyRecommanderIncomeChartsBarDataBreakfast?.push(chartData);
    });
  }

  setNutrimentsChartsBarsDataLunch(nutriments: Nutriments): void {
    this.dailyRecommanderIncomeChartsBarDataLunch = [];
    let nutrimentChartMapLunch =
      ProductUtils.setNutrimentChartBarMap(nutriments);

    nutrimentChartMapLunch.forEach((value: number, key: string) => {
      const dataSetLunch: ChartDataset = {
        label: 'Déjeuner',
        data: [value],
        fill: true,
        backgroundColor: ['#4c7ed0'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
      };

      const dataSetFiller: ChartDataset = {
        label: 'AJR',
        data: [ChartUtils.setValueFiller(this.isMaleReco, key, dataSetLunch)],
        fill: true,
        backgroundColor: ['#f1f1f1'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
      };

      const chartData: ChartData = {
        labels: [key],
        datasets: [dataSetLunch, dataSetFiller],
      };
      this.dailyRecommanderIncomeChartsBarDataLunch?.push(chartData);
    });
  }

  setNutrimentsChartsBarsDataDinner(nutriments: Nutriments): void {
    this.dailyRecommanderIncomeChartsBarDataDinner = [];
    let nutrimentChartMapDinner =
      ProductUtils.setNutrimentChartBarMap(nutriments);

    nutrimentChartMapDinner.forEach((value: number, key: string) => {
      const dataSetDinner: ChartDataset = {
        label: 'Dinner',
        data: [value],
        fill: true,
        backgroundColor: ['#ffc30f'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
      };

      const dataSetFiller: ChartDataset = {
        label: 'AJR',
        data: [ChartUtils.setValueFiller(this.isMaleReco, key, dataSetDinner)],
        fill: true,
        backgroundColor: ['#f1f1f1'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
      };

      const chartData: ChartData = {
        labels: [key],
        datasets: [dataSetDinner, dataSetFiller],
      };
      this.dailyRecommanderIncomeChartsBarDataDinner?.push(chartData);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
