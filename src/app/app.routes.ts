import { Routes } from '@angular/router';
import { CompareProductsComponent } from './features/compare-products/compare-products.component';
import { HomeComponent } from './features/home/home.component';
import { MealComponent } from './features/meal/meal.component';
import { ProductComponent } from './features/product/product.component';
import { requireAnyRole } from './shared/guard/role.guard';
import { RoleAdmin, RoleTier1 } from './shared/constants/role.constant';
import { SettingsComponent } from './features/settings/settings.component';
import { ProfilEditComponent } from './features/settings/profil-edit/profil-edit.component';
import { UserAdminstrationComponent } from './features/user-adminstration/user-adminstration.component';

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
    canActivate: [requireAnyRole(RoleTier1, RoleAdmin)],
  },
  {
    path: 'compare',
    component: CompareProductsComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'administration',
    component: UserAdminstrationComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
];
