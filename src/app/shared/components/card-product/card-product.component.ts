import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { ProductInfosModel } from '../../model/product-attribute-displayed.model';

@Component({
  selector: 'app-card-product',
  imports: [CommonModule, MaterialModule],
  templateUrl: './card-product.component.html',
  standalone: true,
})
export class CardProductComponent {
  @Input() productInfoModel = new ProductInfosModel();
  @Input() isClickable = false;
  @Output('click') clickEventEmitter = new EventEmitter<void>();

  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.isClickable) {
      this.clickEventEmitter.emit();
    } else {
      return;
    }
  }
}
