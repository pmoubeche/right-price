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

// Returns a function which can act as a guard for a route
export function requireAnyRole(...roles: RoleModel[]): CanActivateFn {
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
      router.navigate(['/subscribe']);
      snackbarService.show(
        'Vous devez être connecté pour acceder à cette page'
      );
      return of(false);
    }

    let isUserRoleInRoleGuard: boolean = false;
    roles.forEach((role) => {
      if (currentUserRoles.map((role) => role.id).includes(role.id)) {
        isUserRoleInRoleGuard = true;
      }
    });
    contextService.isAuthenticated().subscribe((isLoggedIn) => {
      isConnected = isLoggedIn;
    });
    if (isConnected && isUserRoleInRoleGuard) {
      return of(true);
    } else {
      router.navigate(['/subscribe']);
      snackbarService.show(
        "Vous n'avez pas les droits pour acceder à cette page"
      );
      return of(false);
    }
  };
}
