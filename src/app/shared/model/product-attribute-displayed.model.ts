import { Observable } from 'rxjs';
import {
  EcoscoreLinks,
  NovagroupLinks,
  NutriscoreLinks,
} from '../enum/svg-urls.enum';
import { ProductMealInfoModel } from '../../../generated';

export class ProductInfosModel {
  id?: string;
  image?: string = 'assets/svg/no_img.jpg';
  label?: string;
  packagingQuantity?: number;
  nutriscore?: string = NutriscoreLinks.NUTRISCORE_UNKNOWN;
  ecoscore?: string = EcoscoreLinks.ECOSCORE_UNKNOWN;
  novagroup?: string = NovagroupLinks.NOVAGROUP_UNKNOWN;
}

export interface MealProductInfoModel extends ProductMealInfoModel {
  isEditable?: boolean;
  isEditable$?: Observable<boolean>;
}

export class Meal {
  id?: string;
  mealType?: string;
  label?: string;
  timeHour?: string;
  disabled?: boolean;
  class?: string;
}
