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
  styleUrl: './detail-product.component.css',
})
export class DetailProductComponent implements OnInit {
  private _httpProduct!: ResponseProduct;
  public ingredientsInfo?: IngredientInfoModel[] = [];
  public nutrimentInfo?: NutrimentInfoModel[] = [];
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
    this.setNutrimentsInfoFromResponseProduct();
    this.nutrimentsDataSources.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.nutrimentInfo);
    this.setChartPieData();
  }

  get httpProduct() {
    return this._httpProduct;
  }

  ingredientDataSources = new PaginatedDataSource<IngredientInfoModel>();
  nutrimentsDataSources = new PaginatedDataSource<NutrimentInfoModel>();

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

  columnParamsNutriments: TableColumnParamModel[] = [
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

  chartPieData?: ChartData;

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

  setNutrimentsInfoFromResponseProduct(): void {
    if (this.product) {
      this.nutrimentInfo = ProductUtils.setNutrimentsTable(
        this.product.nutriments!
      );
    }
  }

  setChartPieData(): void {
    let nutrimentChartPieMap = ProductUtils.setNutrimentChartPieMap(
      this.product?.nutriments!
    );

    this.chartPieData = {
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
}
