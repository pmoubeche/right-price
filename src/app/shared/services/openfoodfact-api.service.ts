import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseProduct, ResponseProducts } from '../model/product.model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OpenFoodFactsApiService {
  constructor(private readonly httpClient: HttpClient) {}

  findProductByBarCode(barcode: string): Observable<ResponseProduct> {
    return this.httpClient.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    ) as Observable<ResponseProduct>;
  }

  findProductsByBrand(
    brandName: string,
    page?: number | undefined
  ): Observable<ResponseProducts> {
    return this.httpClient.get(
      `https://world.openfoodfacts.org/brand/${brandName}/1.json`
    ) as Observable<ResponseProducts>;
  }

  findProductsByCategory(
    category: string,
    page?: number | undefined
  ): Observable<ResponseProducts> {
    return this.httpClient.get(
      `https://world.openfoodfacts.org/category/${category}/1.json`
    ) as Observable<ResponseProducts>;
  }

  findProductsBySearchTerm(
    searchTerm: string,
    page = 1,
    pageSize = 24
  ): Observable<ResponseProducts> {
    return this.httpClient.get(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&page=${page}&fields=id,product_name,image_small_url,nutriscore_grade,ecoscore_grade,nova_group&page_size=${pageSize}&search_simple=1&action=process&json=1.json`
    ) as Observable<ResponseProducts>;
  }
}
