import { Routes } from '@angular/router';
import { AdministrationComponent } from './features/administration/administration.component';
import { CompareProductsComponent } from './features/compare-products/compare-products.component';
import { GlucoseMonitoringComponent } from './features/glucose-monitoring/glucose-monitoring.component';
import { GroceryListComponent } from './features/grocery-list/grocery-list.component';
import { HomeComponent } from './features/home/home.component';
import { MealComponent } from './features/meal/meal.component';
import { DetailProductComponent } from './features/product/detail-product/detail-product.component';
import { ProductComponent } from './features/product/product.component';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';
import { SettingsComponent } from './features/settings/settings.component';
import { SubscriptionComponent } from './features/subscribe/subscribe.component';
import { UserEditComponent } from './features/user-adminstration/user-edit/user-edit.component';
import {
  RoleAdmin,
  RoleTier1,
  RoleTier2,
} from './shared/constants/role.constant';
import { authGuard } from './shared/guard/auth.guard';
import { resetPasswordGuard } from './shared/guard/reset-password.guard';
import { requireAnyRole } from './shared/guard/role.guard';
import { getListDatesWhereMealsResolver } from './shared/routes/grocery-list-resolver.service';
import { getUserByIdResolver } from './shared/routes/user-resolver.service';
import { FavoritesComponent } from './features/favorites/favorites.component';

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
    canActivate: [requireAnyRole(RoleTier1, RoleTier2, RoleAdmin), authGuard()],
    resolve: { dates: getListDatesWhereMealsResolver },
  },
  {
    path: 'grocery',
    component: GroceryListComponent,
    canActivate: [requireAnyRole(RoleTier1, RoleTier2, RoleAdmin), authGuard()],
    resolve: { dates: getListDatesWhereMealsResolver },
  },
  {
    path: 'cgm',
    component: GlucoseMonitoringComponent,
    canActivate: [requireAnyRole(RoleTier2, RoleAdmin), authGuard()],
  },
  {
    path: 'compare',
    component: CompareProductsComponent,
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate: [authGuard()],
  },
  {
    path: 'settings/:id',
    component: SettingsComponent,
    canActivate: [authGuard()],
    resolve: { user: getUserByIdResolver },
  },
  {
    path: 'administration',
    component: AdministrationComponent,
    canActivate: [requireAnyRole(RoleAdmin), authGuard()],
  },
  {
    path: 'user-edit/:id',
    component: UserEditComponent,
    canActivate: [requireAnyRole(RoleAdmin), authGuard()],
  },
  {
    path: 'subscribe',
    component: SubscriptionComponent,
    canActivate: [authGuard()],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [resetPasswordGuard()],
  },
  {
    path: '',
    component: HomeComponent,
  },
];
