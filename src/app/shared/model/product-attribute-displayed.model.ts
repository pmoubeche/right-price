import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

export class ProductInfosModel {
  id?: string;
  image?: string;
  label?: string;
  nutriscore?: string;
  ecoscore?: string;
  novagroup?: string;
}

export class MealProductInfoModel {
  idProduct?: string;
  imageProduct?: string;
  labelProduct?: string;
  nutriscore?: string;
  quantity?: number;
  mealId?: string;
  mealType?: string;
  idLProductMeal?: string;
  date?: string;
  isEditable? = false;
  isEditable$? = new Observable<boolean>();
}

export class MealProductParam {
  mealId?: string;
  barcodeProduct?: string;
  nameProduct?: string;
  imageProduct?: string;
  nutriscore?: string;
  quantity?: number;
  mealType?: string;
  date?: string;
}

export class Meal {
  id?: string;
  label?: string;
}
