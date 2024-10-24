import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { Subscription, switchMap, tap } from 'rxjs';
import { PaginatedDataSource } from '../../../shared/common/paginated/paginated-datasource';
import { CardResultGenericService } from '../../../shared/components/card-result-generic/card-result-generic.service';
import { ChartComponent } from '../../../shared/components/chart/chart.component';
import { ChartUtils } from '../../../shared/components/chart/chart.utils';
import {
  GaugeCardParams,
  GaugeChartCardComponent,
} from '../../../shared/components/gauge-chart-card/gauge-chart-card.component';
import { TableGenericComponent } from '../../../shared/components/table-generic/table-generic.component';
import {
  RoleAdmin,
  RoleTier1,
  RoleTier2,
} from '../../../shared/constants/role.constant';
import { MaterialModule } from '../../../shared/material/material.module';
import { Product, ResponseProduct } from '../../../shared/model/product.model';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../../shared/model/table-column-param.model';
import { PercentFormatPipe } from '../../../shared/pipes/percent-format.pipe';
import { UppercaseFirstLetterFormatPipe } from '../../../shared/pipes/uppercase-first-letter-format.pipe';
import { ContextService } from '../../../shared/services/context.service';
import { OpenFoodFactsApiService } from '../../../shared/services/openfoodfact-api.service';
import { ProductUtils } from '../../../shared/utils/product.utils';
import { CompareProductService } from '../../compare-products/compare-product.service';
import { MealService } from '../../meal/meal.service';

export class IngredientInfoModel {
  id?: string;
  ingredient?: string;
  percentage?: string;
}

export class NutrimentInfoModel {
  id?: string;
  nutriment?: string;
  value?: string;
  valueNumber?: number;
  ajr?: string;
  percentAjr_100g?: number;
  unit?: string;
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
    GaugeChartCardComponent,
  ],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss',
})
export class DetailProductComponent implements OnInit, OnDestroy {
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
    this.ingredientCount = this.product?.ingredients?.length;
    this.ingredientDataSources.dataSource =
      new MatTableDataSource<IngredientInfoModel>(this.ingredientsInfo);
    this.ingredientDataSources.footer = {
      ingredient: 'Total',
      percentage: `${this.ingredientsInfo?.length}`,
    };
    this.setInfoFromResponseProduct();

    this.macroNutrimentsDataSources.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.macroNutrimentInfo);
    this.setMacroNutrimentsChartPieData();

    this.sugarsDataSources.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.sugarsInfo);
    this.setSugarsChartPieData();

    this.microNutrimentsDataSources.dataSource =
      new MatTableDataSource<NutrimentInfoModel>(this.microNutrimentInfo);
    this.setMicroNutrimentsChartBarsData();

    this.setGaugesParamsDatas(httpProduct);
  }

  get httpProduct() {
    return this._httpProduct;
  }

  gaugeChartParamCal = new GaugeCardParams();
  gaugeChartParamProt = new GaugeCardParams();
  gaugeChartParamGluc = new GaugeCardParams();
  gaugeChartParamLip = new GaugeCardParams();

  ingredientCount?: number;

  ingredientDataSources = new PaginatedDataSource<IngredientInfoModel>();
  macroNutrimentsDataSources = new PaginatedDataSource<NutrimentInfoModel>();
  microNutrimentsDataSources = new PaginatedDataSource<NutrimentInfoModel>();
  sugarsDataSources = new PaginatedDataSource<NutrimentInfoModel>();

  columnParamsIngredients: TableColumnParamModel[] = [
    {
      id: '1',
      label: `Ingredients`,
      columDef: 'ingredient',
      type: ColumnTypeParamEnum.STRING,
      applyStyleWithImage: false,
      colWidth: '11rem',
    },
    {
      id: '2',
      label: '%',
      columDef: 'percentage',
      type: ColumnTypeParamEnum.STRING,
      colWidth: '3rem',
    },
  ];

  columnParamsMacroNutriments: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Nutriment',
      columDef: 'nutriment',
      type: ColumnTypeParamEnum.STRING,
      colWidth: '11rem',
    },
    {
      id: '2',
      label: 'Valeur / 100g',
      columDef: 'value',
      type: ColumnTypeParamEnum.STRING,
    },
  ];

  columnParamsSugars: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Sucres',
      columDef: 'nutriment',
      type: ColumnTypeParamEnum.STRING,
      colWidth: '11rem',
    },
    {
      id: '2',
      label: 'Valeur / 100g',
      columDef: 'value',
      type: ColumnTypeParamEnum.STRING,
    },
  ];

  columnParamsMicroNutriments: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Micro-nutriment',
      columDef: 'nutriment',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '2',
      label: 'Valeur pour 100g',
      columDef: 'value',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '3',
      label: 'AJR',
      columDef: 'ajr',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '4',
      label: 'AJR pour 100g',
      columDef: 'percentAjr_100g',
      type: ColumnTypeParamEnum.PERCENT,
    },
  ];

  macroNutrimentschartPieData?: ChartData;
  sugarsChartPieData?: ChartData;
  microNutrimentschartPieData?: ChartData;

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  optionsBar: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
        ticks: { format: { style: 'percent' } },
      },
      x: { stacked: true },
    },
  };

  isTier1 = false;

  subscription = new Subscription();

  constructor(
    private readonly formatPercentPipe: PercentFormatPipe,
    private readonly uppercaseFirstLetter: UppercaseFirstLetterFormatPipe,
    private readonly openFoodFactApiService: OpenFoodFactsApiService,
    private readonly cardResultService: CardResultGenericService,
    private readonly compareProductService: CompareProductService,
    private readonly mealService: MealService,
    private readonly contextService: ContextService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    ChartUtils.setChartImports();
    this.getProductFromOFFApi();
    this.setRights();
  }

  private setRights() {
    this.subscription.add(
      this.contextService
        .getCurrentUser()
        .pipe(
          tap((user) => {
            this.isTier1 =
              user?.roles?.map((role) => role.id).includes(RoleTier1.id)! ||
              user?.roles?.map((role) => role.id).includes(RoleTier2.id)! ||
              user?.roles?.map((role) => role.id).includes(RoleAdmin.id)!;
          })
        )
        .subscribe()
    );
  }

  public backToSearch(): void {
    this.subscription.add(
      this.cardResultService.textSearched$
        .pipe(
          tap((searchText) => {
            this.router.navigate(['/product'], {
              queryParams: { search: searchText },
            });
          })
        )
        .subscribe()
    );
  }

  public redirectAndAddToCompare(): void {
    this.router.navigate(['/compare']);
    this.compareProductService.productBs.next(this.httpProduct.product!);
  }

  public redirectAndAddToMeal(): void {
    this.router.navigate(['/meal']);
    this.mealService.productInfoModelBs.next(
      ProductUtils.setProductInfoFromProduct(this.httpProduct.product!)
    );
  }

  private getProductFromOFFApi(): void {
    this.subscription.add(
      this.activatedRoute.params
        .pipe(
          switchMap((data) =>
            this.openFoodFactApiService.findProductByBarCode(data['id']).pipe(
              tap((httpProduct) => {
                this.httpProduct = httpProduct;
              })
            )
          )
        )
        .subscribe()
    );
  }

  private setGaugesParamsDatas(httpProduct: ResponseProduct) {
    this.gaugeChartParamCal = {
      title: 'Calories',
      color: '#be0e13',
      unit: 'kcal',
      value: httpProduct.product?.nutriments?.['energy-kcal_100g'],
      valueMax: 900,
      height: 30,
      width: 15,
    };
    this.gaugeChartParamProt = {
      title: 'Protéines',
      color: '#FFCE56',
      unit: 'g',
      value: httpProduct.product?.nutriments?.proteins_100g,
      valueMax: 100,
      height: 30,
      width: 15,
    };
    this.gaugeChartParamGluc = {
      title: 'Glucides',
      color: '#36A2EB',
      unit: 'g',
      value: httpProduct.product?.nutriments?.carbohydrates_100g,
      valueMax: 100,
      height: 30,
      width: 15,
    };
    this.gaugeChartParamLip = {
      title: 'Lipides',
      color: '#7fc8c9',
      unit: 'g',
      value: httpProduct.product?.nutriments?.fat_100g,
      valueMax: 100,
      height: 30,
      width: 15,
    };
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
                ingredient.percent_estimate!,
                1
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
    if (this.product) {
      this.product!.nutriments =
        ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(this.product!);
    }
    let nutrimentChartPieMap = ProductUtils.setMacroNutrimentChartPieMap(
      this.product?.nutriments!
    );

    this.macroNutrimentschartPieData = {
      labels: Array.from(nutrimentChartPieMap.keys()),
      datasets: [
        {
          data: Array.from(nutrimentChartPieMap.values()),
          backgroundColor: ['#7fc8c9', '#36A2EB', '#FFCE56', '#F0EBE3'],
          hoverBackgroundColor: ['#7fc8c9', '#36A2EB', '#FFCE56', '#F0EBE3'],
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

  setMicroNutrimentsChartBarsData(): void {
    this.product!.nutriments =
      ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(this.product!);
    let micronutrimentChartMap = ProductUtils.setMicroNutrimentsChartMap(
      this.product?.nutriments!
    );

    this.microNutrimentschartPieData = {
      labels: Array.from(micronutrimentChartMap.keys()),
      datasets: [
        {
          label: 'Pourcentage AJR pour 100g',
          data: Array.from(micronutrimentChartMap.values()),
          fill: true,
          backgroundColor: ['#7fc8c9'],
          borderRadius: {
            topLeft: 15,
            topRight: 15,
            bottomLeft: 15,
            bottomRight: 15,
          },
          borderSkipped: false,
        },
        {
          label: 'Pourcentage AJR (100%)',
          data: Array.from(micronutrimentChartMap.values())
            .map((val) => 1 - val)
            .map((val) => (val < 0 ? 0 : val)),
          fill: true,
          backgroundColor: ['#f1f1f1'],
          borderRadius: {
            topLeft: 15,
            topRight: 15,
            bottomLeft: 15,
            bottomRight: 15,
          },
          borderSkipped: false,
        },
      ],
    };
  }

  redirectToOpenFoodFacts() {
    if (this.product?.id) {
      window.open(
        `https://fr.openfoodfacts.org/produit/${this.product?.id}`,
        '_blank'
      );
    } else {
      window.open(`https://fr.openfoodfacts.org`, '_blank');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
