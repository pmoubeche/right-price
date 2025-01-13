import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../../shared/model/product.model';

@Injectable({ providedIn: 'root' })
export class CompareProductService {
  public productBs = new BehaviorSubject<Product>(new Product());
  public product$ = this.productBs.asObservable();
}
