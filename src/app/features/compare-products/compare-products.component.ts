import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedDataSource } from '../../shared/common/paginated-datasource';
import { CardResultGenericComponent } from '../../shared/components/card-result-generic/card-result-generic.component';
import { TableGenericComponent } from '../../shared/components/table-generic/table-generic.component';
import { MaterialModule } from '../../shared/material/material.module';
import { ProductInfosModel } from '../../shared/model/product-attribute-displayed.model';
import { Product, ResponseProducts } from '../../shared/model/product.model';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../shared/model/table-column-param.model';
import { UppercaseFirstLetterFormatPipe } from '../../shared/pipes/uppercase-first-letter-format.pipe';
import { DragAndDropService } from '../../shared/services/drag-and-drop.service';
import { ProductUtils } from '../../shared/utils/product.utils';
import { NutrimentInfoModel } from '../product/detail-product/detail-product.component';
import { SearchProductComponent } from '../product/search-product/search-product.component';

export class PercentCompareModel {
  id?: string;
  percent?: string;
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
    this.percentCompare = ProductUtils.compareNutrimentsPercentage(
      this.macroNutrimentInfoA,
      this.macroNutrimentInfoB!
    );
    this.compareDataSources.dataSource =
      new MatTableDataSource<PercentCompareModel>(this.percentCompare);
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
    this.percentCompare = ProductUtils.compareNutrimentsPercentage(
      this.macroNutrimentInfoA!,
      this.macroNutrimentInfoB!
    );
    this.compareDataSources.dataSource =
      new MatTableDataSource<PercentCompareModel>(this.percentCompare);
  }

  get productB() {
    return this._productB;
  }

  public macroNutrimentInfoA?: NutrimentInfoModel[] = [];
  public macroNutrimentInfoB?: NutrimentInfoModel[] = [];
  public percentCompare?: PercentCompareModel[] = [];

  macroNutrimentsDataSourcesA = new PaginatedDataSource<NutrimentInfoModel>();
  macroNutrimentsDataSourcesB = new PaginatedDataSource<NutrimentInfoModel>();
  compareDataSources = new PaginatedDataSource<PercentCompareModel>();

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
      type: ColumnTypeParamEnum.STRING,
    },
  ];

  constructor(private readonly dragAndDropService: DragAndDropService) {}

  ngOnInit(): void {}

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
    if (product) {
      product.nutriments =
        ProductUtils.setNutrimentsEstimatedIfNutrimentsUndefined(product);
    }
    return ProductUtils.setMacroNutrimentsTable(product.nutriments!);
  }
}
