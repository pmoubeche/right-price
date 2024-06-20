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
import { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-moment';
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  combineLatest,
  map,
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
import { ResponseProducts } from '../../shared/model/product.model';
import { ProductUtils } from '../../shared/utils/product.utils';

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

  options: ChartOptions = {
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

  private carbsAndSugarsValuesCharts: CarbsAndSugarsValuesCharts[] = [];

  public fileSelected!: File;
  private subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cgmImportServiceApi: CgmImportService,
    private readonly mealSerive: MealProductApiService,
    private readonly openFoodFactApi: OpenFoodFactsApiService,
    private readonly snackbarService: SnackbarService,
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
    this.datesMeals$.subscribe((dates) => {
      const meDates = dates.map((date: any) => new Date(date));
      const index = meDates.findIndex(
        (x: any) =>
          new Date(x).toLocaleDateString() === date.toLocaleDateString()
      );
      if (index > -1) {
        if (meDates[index]) {
          classApplied = 'highlight-date-meals';
        }
      }
      return classApplied;
    });
    this.datesCgms$.subscribe((dates) => {
      const meDates = dates.map((date: any) => new Date(date));
      const index = meDates.findIndex(
        (x: any) =>
          new Date(x).toLocaleDateString() === date.toLocaleDateString()
      );
      if (index > -1) {
        if (meDates[index]) {
          classApplied = 'highlight-date-cgm';
        }
      }
      return classApplied;
    });
    return classApplied;
  };

  onSelectedDate(date: Date): void {
    this.carbsAndSugarsValuesCharts = [];
    this.getCgmData(date);
    this.getMealProductsInfos(date);
  }

  getCgmData(date: Date): void {
    this.subscription.add(
      this.cgmImportServiceApi
        .getCgmByDateAndUser(DateUtils.formatDate(date))
        .pipe(
          tap((res) => {
            this.cgmInfos = res;
            this.setChartData(res);
          })
        )
        .subscribe()
    );
  }

  getMealProductsInfos(date: Date): void {
    this.subscription.add(
      this.mealSerive
        .getMealProducts(DateUtils.formatDate(date))
        .pipe(
          tap((mealProductsInfos) => {
            if (mealProductsInfos.length > 0) {
              this.getHttpProductsFromOFF(mealProductsInfos);
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

            this.setChartData(this.cgmInfos);
          })
        )
        .subscribe()
    );
  }

  // onSelectedDate(date: Date): void {
  //   this.carbsAndSugarsValuesCharts = [];
  //   this.subscription.add(
  //     combineLatest([
  //       this.cgmImportServiceApi.getCgmByDateAndUser(
  //         DateUtils.formatDate(date)
  //       ),
  //       this.mealSerive.getMealProducts(DateUtils.formatDate(date)),
  //     ])
  //       .pipe(
  //         switchMap(([cgmInfos, mealProductInfos]) =>
  //           this.openFoodFactApi
  //             .findProductsByBarcodes(
  //               mealProductInfos.map((info) => info.idProduct!)
  //             )
  //             .pipe(
  //               tap((httpProducts) => {
  //                 this.setCarbMapForBarChart(
  //                   mealProductInfos,
  //                   httpProducts,
  //                   'breakfast'
  //                 );
  //                 this.setCarbMapForBarChart(
  //                   mealProductInfos,
  //                   httpProducts,
  //                   'lunch'
  //                 );
  //                 this.setCarbMapForBarChart(
  //                   mealProductInfos,
  //                   httpProducts,
  //                   'dinner'
  //                 );

  //                 this.setChartData(cgmInfos);
  //               })
  //             )
  //         )
  //       )
  //       .subscribe()
  //   );
  // }

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
        .importGgmFromOrigin(this.deviceSelected, this.fileSelected)
        .pipe(
          tap(() => {
            this.snackbarService.show('Import de données effectué avec succès');
          }),
          catchError(() => {
            this.snackbarService.show(
              "Une erreur est survenue lors de l'import"
            );
            return EMPTY;
          })
        )
        .subscribe()
    );
  }

  setChartData(datasCgm: CgmInfoModel[]): void {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
