import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  MealProductInfoModel,
  MealProductParam,
  ProductInfosModel,
} from '../model/product-attribute-displayed.model';
import { Observable } from 'rxjs';
import { environment } from '../../env-dev';

@Injectable({ providedIn: 'root' })
export class MealProductApiService {
  constructor(private readonly httpClient: HttpClient) {}

  private toHttpParam(req: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(req).forEach(function (key) {
      httpParams = httpParams.append(key, req[key]);
    });
    return httpParams;
  }

  addMealProduct(
    mealProductParam: MealProductParam
  ): Observable<ProductInfosModel> {
    return this.httpClient.post(
      environment.API.ADD_MEAL_PRODUCT_URL,
      mealProductParam
    ) as Observable<ProductInfosModel>;
  }

  updateMealProduct(
    mealProduct: MealProductInfoModel
  ): Observable<MealProductInfoModel> {
    return this.httpClient.put(
      environment.API.UPDATE_MEAL_PRODUCTS_URL,
      mealProduct
    ) as Observable<MealProductInfoModel>;
  }

  getMealProducts(dateString: string): Observable<MealProductInfoModel[]> {
    dateString = dateString.trim();

    const options = dateString
      ? { params: new HttpParams().set('date', dateString) }
      : {};

    return this.httpClient.get(
      environment.API.GET_MEAL_PRODUCTS_URL,
      options
    ) as Observable<MealProductInfoModel[]>;
  }

  deleteMealProduct(id: string): Observable<void> {
    return this.httpClient.delete<void>(
      `${environment.API.DELETE_MEAL_PRODUCTS_URL}/${id}`
    );
  }
}
