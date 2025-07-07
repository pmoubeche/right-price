import { Observable } from 'rxjs';
import { EcoscoreLinks, NovagroupLinks, NutriscoreLinks } from '../enum/svg-urls.enum';

export class ProductInfosModel {
  id?: string;
  image?: string = 'assets/svg/no_img.jpg';
  label?: string;
  packagingQuantity?: number;
  nutriscore?: string = NutriscoreLinks.NUTRISCORE_UNKNOWN;
  ecoscore?: string = EcoscoreLinks.ECOSCORE_UNKNOWN;
  novagroup?: string = NovagroupLinks.NOVAGROUP_UNKNOWN;
}

export class MealProductInfoModel {
  idProduct?: string;
  imageProduct?: string;
  labelProduct?: string;
  nutriscore?: string;
  quantity?: number;
  packagingQuantity?: number;
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
  packagingQuantity?: number;
  mealType?: string;
  date?: string;
}

export class Meal {
  id?: string;
  label?: string;
}
