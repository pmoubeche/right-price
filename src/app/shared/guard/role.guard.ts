import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
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

    let currentUserRoles: RoleModel[] = [];

    contextService.getCurrentUser().subscribe((res) => {
      if (res !== null) {
        currentUserRoles = res!.roles!;
      }
    });

    if (currentUserRoles.length === 0) {
      snackbarService.show(
        'Vous devez être connecté pour acceder à cette page'
      );
      return of(false);
    }

    const isUserRoleInRoleGuard = roles.find(
      (r) => currentUserRoles[0].id === r.id
    )
      ? true
      : false;
    if (contextService.isAuthenticated() && isUserRoleInRoleGuard) {
      return of(true);
    } else {
      snackbarService.show(
        "Vous n`'avez pas les droits pour acceder à cette page"
      );
      return of(false);
    }
  };
}
