import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductComponent } from './features/product/product.component';
import { MealComponent } from './features/meal/meal.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'product',
    component: ProductComponent,
  },
  {
    path: 'meal',
    component: MealComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
