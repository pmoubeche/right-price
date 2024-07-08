import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedDataSource } from '../../shared/common/paginated/paginated-datasource';
import { CardResultGenericComponent } from '../../shared/components/card-result-generic/card-result-generic.component';
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
import { UppercaseFirstLetterFormatPipe } from '../../shared/pipes/uppercase-first-letter-format.pipe';
import { DragAndDropService } from '../../shared/services/drag-and-drop.service';
import { ProductUtils } from '../../shared/utils/product.utils';
import { NutrimentInfoModel } from '../product/detail-product/detail-product.component';
import { SearchProductComponent } from '../product/search-product/search-product.component';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { ChartUtils } from '../../shared/components/chart/chart.utils';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';

export class PercentCompareModel {
  id?: string;
  percent?: string;
}

export class PercentCompareModelNumber {
  id?: string;
  percent?: number;
}

@Component({
  selector: 'app-compare-products',
  standalone: true,
  imports: [
    MaterialModule,
    TableGenericComponent,
    ReactiveFormsModule,
    SearchProductComponent,
    CardResultGenericComponent,
    UppercaseFirstLetterFormatPipe,
    CommonModule,
    CdkDropList,
    CdkDrag,
    ChartComponent,
  ],
  templateUrl: './compare-products.component.html',
  styleUrl: './compare-products.component.scss',
})
export class CompareProductsComponent implements OnInit {
  public _productA = new Product();

  @Input() set productA(productA: Product) {
    this._productA = productA;
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
      ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(productA);
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
      ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(productB);
      this.setNutrimentsChartsBarsData(
        this.productA.nutriments!,
        productB.nutriments!
      );
    }
  }

  get productB() {
    return this._productB;
  }

  public macroNutrimentInfoA?: NutrimentInfoModel[] = [];
  public macroNutrimentInfoB?: NutrimentInfoModel[] = [];
  public percentCompare: PercentCompareModelNumber[] = [];

  macroNutrimentsDataSourcesA = new PaginatedDataSource<NutrimentInfoModel>();
  macroNutrimentsDataSourcesB = new PaginatedDataSource<NutrimentInfoModel>();
  compareDataSources = new PaginatedDataSource<PercentCompareModelNumber>();

  httpProducts!: ResponseProducts;
  public productInfoModelsA = <ProductInfosModel[]>[];
  public productInfoModelsB = <ProductInfosModel[]>[];

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

  constructor(private readonly dragAndDropService: DragAndDropService) {}

  ngOnInit(): void {
    ChartUtils.setChartImports();
  }

  onHttpProductsChange(httpProducts: ResponseProducts): void {
    this.httpProducts = httpProducts;
  }

  drop(event: CdkDragDrop<ProductInfosModel[]>) {
    if (event.container.id === 'productA') {
      this.productInfoModelsA = [];
      this.dragAndDropService.dropCard(event);
      this.productInfoModelsA = event.container.data;
      this.productA = this.httpProducts.products!.find(
        (httpProd) => event.container.data[0].id === httpProd.id
      )!;
    } else if (event.container.id === 'productB') {
      this.productInfoModelsB = [];
      this.dragAndDropService.dropCard(event);
      this.productInfoModelsB = event.container.data;
      this.productB = this.httpProducts.products!.find(
        (httpProd) => event.container.data[0].id === httpProd.id
      )!;
    }
    event.container.data = [];
  }

  setInfoFromResponseProduct(product: Product): NutrimentInfoModel[] {
    return ProductUtils.setMacroNutrimentsTable(product.nutriments!);
  }

  setNutrimentsChartsBarsData(
    nutrimentProductA: Nutriments,
    nutrimentProductB: Nutriments
  ): void {
    let nutrimentChartMapProductA =
      ProductUtils.setNutrimentChartBarMap(nutrimentProductA);

    let nutrimentChartMapProductB =
      ProductUtils.setNutrimentChartBarMap(nutrimentProductB);

    nutrimentChartMapProductA.forEach((value: number, key: string) => {
      const dataSetProductA: ChartDataset = {
        label: 'Produit A',
        data: [value / (value + nutrimentChartMapProductB.get(key)!)],
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

      const dataSetProdutB: ChartDataset = {
        label: 'Produit B',
        data: [
          nutrimentChartMapProductB.get(key)! /
            (value + nutrimentChartMapProductB.get(key)!),
        ],
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

      const chartData: ChartData = {
        labels: [key],
        datasets: [dataSetProductA, dataSetProdutB],
      };
      this.dailyRecommanderIncomeChartsBarData?.push(chartData);
    });
  }
}
