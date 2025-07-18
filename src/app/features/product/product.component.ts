import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import {
  ResponseProduct,
  ResponseProducts,
} from '../../shared/model/product.model';
import { ListProductComponent } from './list-product/list-product.component';
import { SearchProductComponent } from './search-product/search-product.component';

@Component({
  standalone: true,
  selector: 'app-product',
  imports: [SearchProductComponent, ListProductComponent, MaterialModule],
  templateUrl: './product.component.html',
})
export class ProductComponent {
  public httpProducts: ResponseProducts = new ResponseProducts();
  public httpProduct: ResponseProduct = new ResponseProduct();

  onHttpProductsChange(httpProducts: ResponseProducts): void {
    this.httpProducts = httpProducts;
  }

  onHttpProductChange(httpProduct: ResponseProduct): void {
    this.httpProduct = httpProduct;
  }
}
