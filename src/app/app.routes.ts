import { Routes } from '@angular/router';
import { CompareProductsComponent } from './features/compare-products/compare-products.component';
import { HomeComponent } from './features/home/home.component';
import { MealComponent } from './features/meal/meal.component';
import { ProductComponent } from './features/product/product.component';
import { SettingsComponent } from './features/settings/settings.component';
import { RoleAdmin, RoleTier1 } from './shared/constants/role.constant';
import { requireAnyRole } from './shared/guard/role.guard';
import { UserEditComponent } from './features/user-adminstration/user-edit/user-edit.component';
import { AdministrationComponent } from './features/administration/administration.component';
import { GroceryListComponent } from './features/grocery-list/grocery-list.component';
import { getListDatesWhereMealsResolver } from './shared/routes/grocery-list-resolver.service';
import { GlucoseMonitoringComponent } from './features/glucose-monitoring/glucose-monitoring.component';
import { getListDatesWhereCgmResolver } from './shared/routes/cmg-dates-resolver.service';
import { DetailProductComponent } from './features/product/detail-product/detail-product.component';

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
    path: 'product/:id',
    component: DetailProductComponent,
  },
  {
    path: 'meal',
    component: MealComponent,
    canActivate: [requireAnyRole(RoleTier1, RoleAdmin)],
    resolve: { dates: getListDatesWhereMealsResolver },
  },
  {
    path: 'grocery',
    component: GroceryListComponent,
    canActivate: [requireAnyRole(RoleTier1, RoleAdmin)],
    resolve: { dates: getListDatesWhereMealsResolver },
  },
  {
    path: 'cgm',
    component: GlucoseMonitoringComponent,
    canActivate: [requireAnyRole(RoleTier1, RoleAdmin)],
    resolve: {
      datesMeals: getListDatesWhereMealsResolver,
      datesCgm: getListDatesWhereCgmResolver,
    },
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
    component: AdministrationComponent,
    canActivate: [requireAnyRole(RoleAdmin)],
  },
  {
    path: 'user-edit/:id',
    component: UserEditComponent,
    canActivate: [requireAnyRole(RoleAdmin)],
  },
  {
    path: '',
    component: HomeComponent,
  },
];
