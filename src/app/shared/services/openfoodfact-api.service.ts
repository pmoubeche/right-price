import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ResponseProduct, ResponseProducts } from '../model/product.model';
import { Injectable } from '@angular/core';
import { ProductInfosModel } from '../model/product-attribute-displayed.model';
import { ProductUtils } from '../utils/product.utils';

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
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${searchTerm}&page=${page}&fields=id,product_name,image_small_url,nutriscore_grade,ecoscore_grade,nova_group,product_quantity,nutriments,nutriments_estimated&page_size=${pageSize}&search_simple=1&action=process&json=1.json`
    ) as Observable<ResponseProducts>;
  }

  findProductsByBarcodes(
    barcodes: string[],
    page = 1,
    pageSize = barcodes.length
  ): Observable<ResponseProducts> {
    let stringBarcodes: string = '';
    if (barcodes.length > 0) {
      if (barcodes.length === 1) {
        stringBarcodes = barcodes[0];
      } else {
        barcodes.forEach((barcode) => {
          stringBarcodes += `${barcode},`;
        });
        stringBarcodes = stringBarcodes.slice(0, -1);
      }
    }
    return this.httpClient.get(
      `https://world.openfoodfacts.org/api/v0/search?code=${stringBarcodes}&page=${page}&fields=id,product_name,image_small_url,nutriscore_grade,ecoscore_grade,nova_group,nutriments,nutriments_estimated&page_size=${pageSize}`
    ) as Observable<ResponseProducts>;
  }

  fromResponseProductsToProductInfos(
    responseProducts$: Observable<ResponseProducts>
  ): Observable<ProductInfosModel[]> {
    return responseProducts$.pipe(
      map((response) =>
        ProductUtils.setProductsInfoFromResponseProducts(response)
      )
    );
  }
}
