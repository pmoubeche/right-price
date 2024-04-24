import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ChartData, ChartOptions } from 'chart.js';
import { PaginatedDataSource } from '../../../shared/common/paginated-datasource';
import { ChartComponent } from '../../../shared/components/chart/chart.component';
import { TableGenericComponent } from '../../../shared/components/table-generic/table-generic.component';
import { MaterialModule } from '../../../shared/material/material.module';
import { Product, ResponseProduct } from '../../../shared/model/product.model';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../../shared/model/table-column-param.model';
import { PercentFormatPipe } from '../../../shared/pipes/percent-format.pipe';
import { UppercaseFirstLetterFormatPipe } from '../../../shared/pipes/uppercase-first-letter-format.pipe';
import { ProductUtils } from '../../../shared/utils/product.utils';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

export class IngredientInfoModel {
  id?: string;
  ingredient?: string;
  percentage?: string;
}

export class NutrimentInfoModel {
  id?: string;
  nutriment?: string;
  value?: string;
  ajr?: string;
  percentAjr_100g?: number;
}

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [
    MaterialModule,
    TableGenericComponent,
    PercentFormatPipe,
    UppercaseFirstLetterFormatPipe,
    ChartComponent,
  ],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss',
})
export class DetailProductComponent implements OnInit {
  private _httpProduct!: ResponseProduct;
  public ingredientsInfo?: IngredientInfoModel[] = [];
  public macroNutrimentInfo?: NutrimentInfoModel[] = [];
  public microNutrimentInfo?: NutrimentInfoModel[] = [];
  public sugarsInfo?: NutrimentInfoModel[] = [];
  public product?: Product;

  public nutriscoreImageUrl?: string;
  public ecoscoreImageUrl?: string;
  public novagroupImageUrl?: string;

  @Input() set httpProduct(httpProduct: ResponseProduct) {
    this._httpProduct = httpProduct;
    this.product = httpProduct.product;
    this.setUrlsForImagesCard();
    this.setIngredientsInfoFromResponseProduct();
    this.ingredientDataSources.dataSource =
      new MatTableDataSource<IngredientInfoModel>(this.ingredientsInfo);
    this.setInfoFromResponseProduct();

    this.macroNutrimentsDataSources.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.macroNutrimentInfo);
    this.setMacroNutrimentsChartPieData();

    this.microNutrimentsDataSources.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.microNutrimentInfo);
    this.setSugarsChartPieData();
    this.sugarsDataSources.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.sugarsInfo);
  }

  get httpProduct() {
    return this._httpProduct;
  }

  ingredientDataSources = new PaginatedDataSource<IngredientInfoModel>();
  macroNutrimentsDataSources = new PaginatedDataSource<NutrimentInfoModel>();
  microNutrimentsDataSources = new PaginatedDataSource<NutrimentInfoModel>();
  sugarsDataSources = new PaginatedDataSource<NutrimentInfoModel>();

  columnParamsIngredients: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Ingredient',
      columDef: 'ingredient',
      type: ColumnTypeParamEnum.STRING,
      applyStyleWithImage: false,
    },
    {
      id: '2',
      label: 'Percentage',
      columDef: 'percentage',
      type: ColumnTypeParamEnum.STRING,
    },
  ];

  columnParamsMacroNutriments: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Nutriment',
      columDef: 'nutriment',
      type: ColumnTypeParamEnum.STRING,
      applyStyleWithImage: false,
    },
    {
      id: '2',
      label: 'Value per 100g',
      columDef: 'value',
      type: ColumnTypeParamEnum.STRING,
    },
  ];

  columnParamsSugars: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Sugars',
      columDef: 'nutriment',
      type: ColumnTypeParamEnum.STRING,
      applyStyleWithImage: false,
    },
    {
      id: '2',
      label: 'Value per 100g',
      columDef: 'value',
      type: ColumnTypeParamEnum.STRING,
    },
  ];

  macroNutrimentschartPieData?: ChartData;
  sugarsChartPieData?: ChartData;

  chartOptions: ChartOptions = {
    responsive: true,
  };

  constructor(
    private readonly formatPercentPipe: PercentFormatPipe,
    private readonly uppercaseFirstLetter: UppercaseFirstLetterFormatPipe
  ) {}

  ngOnInit(): void {
    Chart.register(
      ArcElement,
      BarController,
      BarElement,
      CategoryScale,
      DoughnutController,
      LinearScale,
      LineController,
      LineElement,
      PieController,
      PointElement,
      PolarAreaController,
      RadarController,
      RadialLinearScale,
      Title,
      Tooltip,
      Legend
    );
  }

  private setUrlsForImagesCard() {
    this.nutriscoreImageUrl = ProductUtils.getUrlNutriscore(
      this.product?.nutriscore_grade!
    );
    this.ecoscoreImageUrl = ProductUtils.getUrlEcoscore(
      this.product?.ecoscore_grade!
    );
    this.novagroupImageUrl = ProductUtils.getUrlNovagroup(
      this.product?.nova_group!
    );
  }

  setIngredientsInfoFromResponseProduct(): void {
    if (this.product) {
      this.ingredientsInfo = this.product.ingredients
        ?.map(
          (ingredient) =>
            ({
              id: ingredient.id,
              ingredient: this.uppercaseFirstLetter.transform(ingredient.text!),
              percentage: this.formatPercentPipe.transform(
                ingredient.percent_estimate!
              ),
            } as IngredientInfoModel)
        )
        .filter(
          (ingredient) => Number.parseFloat(ingredient.percentage!) > 0.5
        );
    }
  }

  setInfoFromResponseProduct(): void {
    if (this.product) {
      this.product.nutriments =
        ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(this.product);
      this.macroNutrimentInfo = ProductUtils.setMacroNutrimentsTable(
        this.product.nutriments!
      );
      this.sugarsInfo = ProductUtils.setSugarsTable(this.product.nutriments!);
      this.microNutrimentInfo = ProductUtils.setMicroNutrimentsTable(
        this.product.nutriments!
      );
    }
  }

  setMacroNutrimentsChartPieData(): void {
    this.product!.nutriments =
      ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(this.product!);
    let nutrimentChartPieMap = ProductUtils.setMacroNutrimentChartPieMap(
      this.product?.nutriments!
    );

    this.macroNutrimentschartPieData = {
      labels: Array.from(nutrimentChartPieMap.keys()),
      datasets: [
        {
          data: Array.from(nutrimentChartPieMap.values()),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#F0EBE3'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#F0EBE3'],
        },
      ],
    };
  }

  setSugarsChartPieData(): void {
    this.product!.nutriments =
      ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(this.product!);
    let sugarsChartPieMap = ProductUtils.setSugarsChartPieMap(
      this.product?.nutriments!
    );

    this.sugarsChartPieData = {
      labels: Array.from(sugarsChartPieMap.keys()),
      datasets: [
        {
          data: Array.from(sugarsChartPieMap.values()),
          backgroundColor: [
            '#21428d',
            '#2b5fad',
            '#3170bf',
            '#3881d2',
            '#4c7ed0',
            '#529ee4',
            '#6dafe8',
          ],
          hoverBackgroundColor: [
            '#21428d',
            '#2b5fad',
            '#3170bf',
            '#3881d2',
            '#4c7ed0',
            '#529ee4',
            '#6dafe8',
          ],
        },
      ],
    };
  }
}
