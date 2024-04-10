import { Component, Input } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { Product } from '../../../shared/model/product.model';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css',
})
export class DetailProductComponent {
  @Input() product?: Product;
}
