import { Component, Input } from '@angular/core';
import { SearchProductComponent } from '../../product/search-product/search-product.component';
import { CardResultGenericComponent } from '../../../shared/components/card-result-generic/card-result-generic.component';
import {
  ResponseProduct,
  ResponseProducts,
} from '../../../shared/model/product.model';
import { ProductInfosModel } from '../../../shared/model/product-attribute-displayed.model';
import { PaginatedDataSource } from '../../../shared/common/paginated-datasource';
import { MatTableDataSource } from '@angular/material/table';
import { UppercaseFirstLetterFormatPipe } from '../../../shared/pipes/uppercase-first-letter-format.pipe';
import { ProductUtils } from '../../../shared/utils/product.utils';
import { MaterialModule } from '../../../shared/material/material.module';

@Component({
  selector: 'app-rapid-search-product',
  standalone: true,
  imports: [MaterialModule, SearchProductComponent, CardResultGenericComponent],
  templateUrl: './rapid-search-product.component.html',
  styleUrl: './rapid-search-product.component.scss',
})
export class RapidSearchProductComponent {
  public httpProduct: ResponseProduct = new ResponseProduct();

  onHttpProductsChange(httpProducts: ResponseProducts): void {
    this.httpProducts = httpProducts;
  }

  onHttpProductChange(httpProducts: ResponseProduct): void {
    this.httpProduct = httpProducts;
  }

  @Input() httpProducts!: ResponseProducts;
}
