import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { Subscription, tap } from 'rxjs';
import { ChartComponent } from '../../../shared/components/chart/chart.component';
import { ChartUtils } from '../../../shared/components/chart/chart.utils';
import { MaterialModule } from '../../../shared/material/material.module';
import { MealProductInfoModel } from '../../../shared/model/product-attribute-displayed.model';
import {
  Nutriments,
  Product,
  ResponseProducts,
} from '../../../shared/model/product.model';
import { RoundNumberDecimalPipe } from '../../../shared/pipes/round-number-decimal.pipe';
import { OpenFoodFactsApiService } from '../../../shared/services/openfoodfact-api.service';
import { ProductUtils } from '../../../shared/utils/product.utils';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chart-meal-product',
  standalone: true,
  imports: [
    ChartComponent,
    MaterialModule,
    CommonModule,
    RoundNumberDecimalPipe,
    FormsModule,
  ],
  templateUrl: './chart-meal-product.component.html',
  styleUrl: './chart-meal-product.component.scss',
})
export class ChartMealProductComponent implements OnInit, OnDestroy {
  private _mealProductsBreakfast!: MealProductInfoModel[];
  public isMaleReco = true;

  @Input() set mealProductsBreakfast(
    mealProductsBreakfast: MealProductInfoModel[]
  ) {
    this._mealProductsBreakfast = mealProductsBreakfast;
    if (mealProductsBreakfast) {
      this.barcodesBreakfast = mealProductsBreakfast.map(
        (mealProduct) => mealProduct.idProduct!
      );
    }
    this.findProductsAndSetNutrimentsMeal(
      this.barcodesBreakfast!,
      mealProductsBreakfast,
      'breakfast'
    );
  }

  get mealProductsBreakfast() {
    return this._mealProductsBreakfast;
  }

  private _mealProductsLunch!: MealProductInfoModel[];

  @Input() set mealProductsLunch(mealProductsLunch: MealProductInfoModel[]) {
    this._mealProductsLunch = mealProductsLunch;

    if (mealProductsLunch) {
      this.barcodesLunch = mealProductsLunch.map(
        (mealProduct) => mealProduct.idProduct!
      );
    }
    this.findProductsAndSetNutrimentsMeal(
      this.barcodesLunch!,
      mealProductsLunch,
      'lunch'
    );
  }

  get mealProductsLunch() {
    return this._mealProductsLunch;
  }

  private _mealProductsDinner!: MealProductInfoModel[];

  @Input() set mealProductsDinner(mealProductsDinner: MealProductInfoModel[]) {
    this._mealProductsDinner = mealProductsDinner;
    if (mealProductsDinner) {
      this.barcodesDinner = mealProductsDinner.map(
        (mealProduct) => mealProduct.idProduct!
      );
    }
    this.findProductsAndSetNutrimentsMeal(
      this.barcodesDinner!,
      mealProductsDinner,
      'dinner'
    );
  }

  get mealProductsDinner() {
    return this._mealProductsDinner;
  }

  barcodesBreakfast?: string[] = [];
  barcodesLunch: string[] = [];
  barcodesDinner: string[] = [];

  nutrimentsBreakfast: Nutriments = new Nutriments();
  nutrimentsLunch: Nutriments = new Nutriments();
  nutrimentsDinner: Nutriments = new Nutriments();

  public isDisplayedLegend: boolean = true;

  dailyRecommanderIncomeChartsBarData?: { label: string; chart: ChartData }[];

  optionsBar: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
      },
      y: { stacked: true, display: false },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  subscription = new Subscription();

  constructor(
    private readonly openFoodFactApiService: OpenFoodFactsApiService,
    private readonly roundNumberPipe: RoundNumberDecimalPipe
  ) {}

  ngOnInit(): void {
    ChartUtils.setChartImports();
  }

  private findProductsAndSetNutrimentsMeal(
    barcodes: string[],
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

    if (barcodes.length > 0) {
      this.subscription.add(
        this.openFoodFactApiService
          .findProductsByBarcodes(barcodes)
          .pipe(
            tap((httpProducts: ResponseProducts) => {
              if (httpProducts.products?.length! > 0) {
                httpProducts.products?.forEach((product) => {
                  product!.nutriments =
                    ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(
                      product!
                    );
                });

                nutrimentList.forEach((nutAttr) => {
                  let attr = nutAttr as keyof typeof Nutriments;
                  //@ts-ignore
                  nutriments[attr] = this.sumNutrimentsInMeal(
                    nutAttr,
                    httpProducts.products!,
                    mealProducts
                  );
                });

                this.setNutrimentToNutrimentList(mealType, nutriments);
                this.setNutrimentsChartsBarsData(
                  this.nutrimentsBreakfast,
                  this.nutrimentsLunch,
                  this.nutrimentsDinner
                );
              }
            })
          )
          .subscribe()
      );
    } else {
      this.setNutrimentsData(nutriments, 0, mealType);

      this.setNutrimentsChartsBarsData(
        this.nutrimentsBreakfast,
        this.nutrimentsLunch,
        this.nutrimentsDinner
      );
    }
  }

  setNutrimentsData(
    nutriments: Nutriments,
    value: number,
    mealType: 'breakfast' | 'lunch' | 'dinner'
  ): void {
    nutriments['energy-kj_100g'] = value;
    nutriments['energy-kcal_100g'] = value;
    nutriments['carbohydrates_100g'] = value;
    nutriments['sugars_100g'] = value;
    nutriments['proteins_100g'] = value;
    nutriments['fat_100g'] = value;
    nutriments['saturated-fat_100g'] = value;
    nutriments['fiber_100g'] = value;
    nutriments['salt_100g'] = value;

    this.setNutrimentToNutrimentList(mealType, nutriments);
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

  sumNutrimentsInMeal(
    labelNutriment: string,
    listProduct: Product[],
    mealProducts: MealProductInfoModel[]
  ): number {
    if (mealProducts.length === 0) {
      return 0;
    }

    let sum = 0;

    listProduct.forEach((product) => {
      type ObjectKey = keyof typeof product.nutriments;
      const attr = labelNutriment as ObjectKey;
      let mealProduct = mealProducts.find(
        (meal) => product.id === meal.idProduct
      );
      sum += product.nutriments![attr] * (mealProduct?.quantity! / 100);
    });

    return this.roundNumberPipe.transform(sum, 2);
  }

  setNutrimentsChartsBarsData(
    nutrimentBreakfast: Nutriments,
    nutrimentLunch: Nutriments,
    nutrimentDinner: Nutriments
  ): void {
    this.dailyRecommanderIncomeChartsBarData = [];
    let nutrimentChartMapBreakfast =
      ProductUtils.setNutrimentChartBarMap(nutrimentBreakfast);

    let nutrimentChartMapLunch =
      ProductUtils.setNutrimentChartBarMap(nutrimentLunch);

    let nutrimentChartMapDinner =
      ProductUtils.setNutrimentChartBarMap(nutrimentDinner);

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
        stack: '0',
      };

      const dataSetLunch: ChartDataset = {
        label: 'Déjeuner',
        data: [nutrimentChartMapLunch.get(key)!],
        fill: true,
        backgroundColor: ['#4c7ed0'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
        stack: '0',
      };

      const dataSetDinner: ChartDataset = {
        label: 'Dinner',
        data: [nutrimentChartMapDinner.get(key)!],
        fill: true,
        backgroundColor: ['#ffc30f'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
        stack: '0',
      };

      const dataSetFiller: ChartDataset = {
        label: 'AJR',
        data: [ChartUtils.setValueFillerFull(this.isMaleReco, key)],
        fill: true,
        backgroundColor: ['#f1f1f1'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
        stack: '1',
      };

      const chartData: ChartData = {
        labels: [key],
        datasets: [
          dataSetBreakfast,
          dataSetLunch,
          dataSetDinner,
          dataSetFiller,
        ],
      };
      this.dailyRecommanderIncomeChartsBarData?.push({
        label: key,
        chart: chartData,
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
