import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardResultGenericComponent } from '../../../shared/components/card-result-generic/card-result-generic.component';
import { MaterialModule } from '../../../shared/material/material.module';
import {
  ResponseProduct,
  ResponseProducts,
} from '../../../shared/model/product.model';
import { SearchProductComponent } from '../../product/search-product/search-product.component';
import { MealProductInfoModel } from '../../../shared/model/product-attribute-displayed.model';

@Component({
  selector: 'app-rapid-search-product',
  standalone: true,
  imports: [MaterialModule, SearchProductComponent, CardResultGenericComponent],
  templateUrl: './rapid-search-product.component.html',
  styleUrl: './rapid-search-product.component.scss',
})
export class RapidSearchProductComponent {
  public httpProduct: ResponseProduct = new ResponseProduct();
  httpProducts!: ResponseProducts;
  pageSize = 6;

  @Output() eventHttpProductChange = new EventEmitter<ResponseProduct>();
  @Output() eventAddProduct = new EventEmitter<MealProductInfoModel>();

  onHttpProductsChange(httpProducts: ResponseProducts): void {
    this.httpProducts = httpProducts;
  }

  onHttpProductChange(httpProduct: ResponseProduct): void {
    this.httpProduct = httpProduct;
  }

  onAddProduct(mealProduct: MealProductInfoModel) {
    this.eventAddProduct.emit(mealProduct);
  }
}
