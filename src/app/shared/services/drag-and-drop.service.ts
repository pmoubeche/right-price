import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { ProductInfosModel } from '../model/product-attribute-displayed.model';

@Injectable({ providedIn: 'root' })
export class DragAndDropService {
  constructor() {}

  public dropCard(event: CdkDragDrop<ProductInfosModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
