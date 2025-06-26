import { Component, Input } from '@angular/core';
import { CardResultGenericComponent } from '../../../shared/components/card-result-generic/card-result-generic.component';
import { MaterialModule } from '../../../shared/material/material.module';
import { ResponseProducts } from '../../../shared/model/product.model';

@Component({
    selector: 'app-list-product',
    imports: [MaterialModule, CardResultGenericComponent],
    templateUrl: './list-product.component.html',
    styleUrl: './list-product.component.scss'
})
export class ListProductComponent {
  @Input() httpProducts!: ResponseProducts;
}
