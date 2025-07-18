import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../generated';

export function resetPasswordGuard(): CanActivateFn {
  return (
    ars: ActivatedRouteSnapshot,
    rss: RouterStateSnapshot
  ): Observable<boolean> => {
    const token = ars.queryParamMap.get('token');

    const authService = inject(AuthService);
    const router = inject(Router);
    const toastr = inject(ToastrService);

    if (!token) {
      toastr.error('Token manquant dans le lien');
      router.navigate(['/']);
      return of(false);
    }

    return authService.verifyResetToken({ token }).pipe(
      map(() => true), // Token valide → accès autorisé
      catchError(() => {
        toastr.error('Lien de réinitialisation expiré ou invalide');
        router.navigate(['/']);
        return of(false);
      })
    );
  };
}
