import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { Subscription, tap } from 'rxjs';
import { PaginatedDataSource } from '../../shared/common/paginated/paginated-datasource';
import { CardResultGenericService } from '../../shared/components/card-result-generic/card-result-generic.service';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { ChartUtils } from '../../shared/components/chart/chart.utils';
import { TableGenericComponent } from '../../shared/components/table-generic/table-generic.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ProductInfosModel } from '../../shared/model/product-attribute-displayed.model';
import {
  Nutriments,
  Product,
  ResponseProducts,
} from '../../shared/model/product.model';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../shared/model/table-column-param.model';
import { RoundNumberDecimalPipe } from '../../shared/pipes/round-number-decimal.pipe';
import { OpenFoodFactsApiService } from '../../shared/services/openfoodfact-api.service';
import { ProductUtils } from '../../shared/utils/product.utils';
import { NutrimentInfoModel } from '../product/detail-product/detail-product.component';
import { SearchProductAutocompleteComponent } from '../product/search-product-autocomplete/search-product-autocomplete.component';

export class PercentCompareModel {
  id?: string;
  percent?: string;
}

export class PercentCompareModelNumber {
  id?: string;
  percent?: number;
  diffValue?: number;
  unit?: string;
}

@Component({
    selector: 'app-compare-products',
    imports: [
        MaterialModule,
        TableGenericComponent,
        ReactiveFormsModule,
        RoundNumberDecimalPipe,
        SearchProductAutocompleteComponent,
        CommonModule,
        ChartComponent,
    ],
    templateUrl: './compare-products.component.html',
})
export class CompareProductsComponent implements OnInit {
  public _productA = new Product();

  public productInfoModelSelected = new ProductInfosModel();

  @Input() set productA(productA: Product) {
    this._productA = productA;
    productA.nutriments =
      ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(productA);
    this.macroNutrimentInfoA = this.setInfoFromResponseProduct(productA);
    this.macroNutrimentsDataSourcesA.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.macroNutrimentInfoA);
    this.percentCompare = ProductUtils.compareNutrimentsPercentageWithoutPipe(
      this.macroNutrimentInfoA,
      this.macroNutrimentInfoB!
    );
    this.compareDataSources.dataSource =
      new MatTableDataSource<PercentCompareModelNumber>(this.percentCompare);
    if (productA.id !== this.productB.id) {
      this.setNutrimentsChartsBarsData(
        productA.nutriments!,
        this.productB.nutriments!
      );
    }
  }

  get productA() {
    return this._productA;
  }

  public _productB = new Product();

  @Input() set productB(productB: Product) {
    this._productB = productB;
    productB.nutriments =
      ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(productB);
    this.macroNutrimentInfoB = this.setInfoFromResponseProduct(productB);
    this.macroNutrimentsDataSourcesB.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.macroNutrimentInfoB);
    this.percentCompare = ProductUtils.compareNutrimentsPercentageWithoutPipe(
      this.macroNutrimentInfoA!,
      this.macroNutrimentInfoB!
    );
    this.compareDataSources.dataSource =
      new MatTableDataSource<PercentCompareModelNumber>(this.percentCompare);
    if (productB.id !== this.productA.id) {
      this.setNutrimentsChartsBarsData(
        this.productA.nutriments!,
        productB.nutriments!
      );
    }
  }

  get productB() {
    return this._productB;
  }

  public macroNutrimentInfoA: NutrimentInfoModel[] = ProductUtils.setMacroNutrimentsDefaultValues();
  public macroNutrimentInfoB: NutrimentInfoModel[] = ProductUtils.setMacroNutrimentsDefaultValues();
  public percentCompare: PercentCompareModelNumber[] = [];

  macroNutrimentsDataSourcesA = new PaginatedDataSource<NutrimentInfoModel>();
  macroNutrimentsDataSourcesB = new PaginatedDataSource<NutrimentInfoModel>();
  compareDataSources = new PaginatedDataSource<PercentCompareModelNumber>();

  httpProducts!: ResponseProducts;
  public productInfoModelA = new ProductInfosModel();
  public productInfoModelB = new ProductInfosModel();

  columnParamsMacroNutriments: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Nutriment',
      columDef: 'nutriment',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '2',
      label: 'Valeur pour 100g',
      columDef: 'value',
      type: ColumnTypeParamEnum.STRING,
    },
  ];

  columnParamsCompare: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Pourcentage Produit A / Produit B',
      columDef: 'percent',
      colWidth: '100%',
      type: ColumnTypeParamEnum.PERCENT,
    },
  ];

  optionsBar: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    scales: {
      x: {
        display: false,
        beginAtZero: true,
        stacked: true,
        ticks: { format: { style: 'percent' } },
      },
      y: { display: false, stacked: true, position: 'left' },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  dailyRecommanderIncomeChartsBarData?: ChartData[] = [];

  private subscription = new Subscription();

  constructor(
    private readonly cardsService: CardResultGenericService,
    private readonly openFoodFactsApiService: OpenFoodFactsApiService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.macroNutrimentsDataSourcesA.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.macroNutrimentInfoA);
    this.macroNutrimentsDataSourcesB.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.macroNutrimentInfoB);
    this.setNutrimentsChartsBarsData(
      this.productA.nutriments!,
      this.productB.nutriments!
    );
    ChartUtils.setChartImports();
    this.cardsService.selectItem$.subscribe((item) => {
      this.productInfoModelSelected = item;
    });
  }

  viewProduct(productInfoModel: ProductInfosModel): void {
    this.router.navigate(['/product', productInfoModel.id]);
  }

  addProductToLeft(productInfo: ProductInfosModel): void {
    this.productInfoModelA = productInfo;

    this.subscription.add(
      this.openFoodFactsApiService
        .findProductByBarCode(productInfo.id!)
        .pipe(
          tap((httpProduct) => {
            this.productA = httpProduct.product!;
          })
        )
        .subscribe()
    );
  }

  addProductToRight(productInfo: ProductInfosModel): void {
    this.productInfoModelB = productInfo;
    this.subscription.add(
      this.openFoodFactsApiService
        .findProductByBarCode(productInfo.id!)
        .pipe(
          tap((httpProduct) => {
            this.productB = httpProduct.product!;
          })
        )
        .subscribe()
    );
  }

  onHttpProductsChange(httpProducts: ResponseProducts): void {
    this.httpProducts = httpProducts;
  }

  setInfoFromResponseProduct(product: Product): NutrimentInfoModel[] {
    return ProductUtils.setMacroNutrimentsTable(product.nutriments!);
  }

  setNutrimentsChartsBarsData(
    nutrimentProductA: Nutriments,
    nutrimentProductB: Nutriments
  ): void {
    this.dailyRecommanderIncomeChartsBarData = [];
    let nutrimentChartMapProductA =
      ProductUtils.setNutrimentChartBarMap(nutrimentProductA);

    let nutrimentChartMapProductB =
      ProductUtils.setNutrimentChartBarMap(nutrimentProductB);

    nutrimentChartMapProductA.forEach((value: number, key: string) => {
      const dataSetProductA: ChartDataset = {
        label: 'Produit A',
        data: [value / (value + nutrimentChartMapProductB.get(key)!)],
        fill: true,
        backgroundColor: ['#13deb9'],
        borderRadius: {
          topLeft: 15,
          topRight: 15,
          bottomLeft: 15,
          bottomRight: 15,
        },
        borderSkipped: false,
      };

      const dataSetProdutB: ChartDataset = {
        label: 'Produit B',
        data: [
          nutrimentChartMapProductB.get(key)! /
            (value + nutrimentChartMapProductB.get(key)!),
        ],
        fill: true,
        backgroundColor: ['#ffae1f'],
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
        datasets: [dataSetProductA, dataSetProdutB],
      };
      this.dailyRecommanderIncomeChartsBarData?.push(chartData);
    });
  }
}
