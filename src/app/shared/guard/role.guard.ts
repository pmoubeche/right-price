import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { of } from 'rxjs';
import { RoleModel } from '../model/role.model';
import { ContextService } from '../services/context.service';
import { SnackbarService } from '../services/snackbar.service';
import { RoleTier2 } from '../constants/role.constant';

// Returns a function which can act as a guard for a route
export function requireAnyRole(...rolesGuard: RoleModel[]): CanActivateFn {
  return (ars: ActivatedRouteSnapshot, rss: RouterStateSnapshot) => {
    const contextService = inject(ContextService);
    const snackbarService = inject(SnackbarService);
    const router = inject(Router);

    let currentUserRoles: RoleModel[] = [];
    let isConnected = false;

    contextService.getCurrentUser().subscribe((res) => {
      if (res !== null) {
        currentUserRoles = res!.roles!;
      }
    });

    if (currentUserRoles.length === 0) {
      router.navigate(['/subscribe'], {
        queryParams: { origin: ars.routeConfig?.path },
      });
      snackbarService.show(
        'Vous devez être connecté pour acceder à cette page'
      );
      return of(false);
    }

    let isUserRoleInRoleGuard: boolean = false;
    rolesGuard.forEach((roleGuard) => {
      if (
        currentUserRoles.map((roleUser) => roleUser.id).includes(roleGuard.id)
      ) {
        isUserRoleInRoleGuard = true;
      }
    });
    contextService.isAuthenticated().subscribe((isLoggedIn) => {
      isConnected = isLoggedIn;
    });
    if (isConnected && isUserRoleInRoleGuard) {
      return of(true);
    } else {
      router.navigate(['/subscribe'], {
        queryParams: { origin: ars.routeConfig?.path },
      });
      snackbarService.show(
        "Vous n'avez pas les droits pour acceder à cette page"
      );
      return of(false);
    }
  };
}
