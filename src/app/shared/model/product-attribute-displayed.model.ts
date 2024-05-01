import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export class ProductInfosModel {
  id?: string;
  image?: string;
  label?: string;
  nutriscore?: string;
  ecoscore?: string;
  novagroup?: string;
}

export class MealProductInfoModel {
  id?: string;
  image?: string;
  label?: string;
  nutriscore?: string;
  quantity?: number;
  meal?: string;
  date?: string;
}

export class Meal {
  id?: string;
  label?: string;
}
