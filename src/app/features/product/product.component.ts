import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { ProductInfosModel } from '../../shared/model/product-attribute-displayed.model';
import {
  Product,
  ResponseProduct,
  ResponseProducts,
} from '../../shared/model/product.model';
import { DetailProductComponent } from './detail-product/detail-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { SearchProductComponent } from './search-product/search-product.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    SearchProductComponent,
    DetailProductComponent,
    ListProductComponent,
    MaterialModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  public httpProducts: ResponseProducts = new ResponseProducts();
  public httpProduct: ResponseProduct = new ResponseProduct();

  productsAttributesToDisplay: ProductInfosModel[] = [];

  onHttpProductsChange(httpProducts: ResponseProducts): void {
    this.httpProducts = httpProducts;
  }

  onHttpProductChange(httpProducts: ResponseProduct): void {
    this.httpProduct = httpProducts;
  }
}
