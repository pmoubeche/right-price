import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { of, Observable } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
  RefreshTokenService,
} from '../../../generated';
import { ContextService } from '../services/context.service';
import { TokenStorageService } from '../services/token-storage.service';
import { AuthServiceFront } from '../services/auth-front.service';

export function authGuard(): CanActivateFn {
  return (
    ars: ActivatedRouteSnapshot,
    rss: RouterStateSnapshot
  ): Observable<boolean> => {
    const tokenService = inject(TokenStorageService);
    const refreshTokenService = inject(RefreshTokenService);
    const contextService = inject(ContextService);
    const authFrontService = inject(AuthServiceFront);

    return contextService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          authFrontService.logOut();
          return of(false);
        }

        if (!tokenService.isAccessTokenExpired()) {
          return of(true);
        }

        // Handle token refresh if access token is expired
        const refreshTokenModel: RefreshTokenRequest =
          tokenService.setRefreshTokenRequest();

        return refreshTokenService.refreshToken(refreshTokenModel).pipe(
          map((response: RefreshTokenResponse) => {
            if (response.refreshToken === tokenService.getRefreshToken()) {
              authFrontService.logOut();
              return false;
            }
            tokenService.saveRefreshTokenResponseInLocalStorage(response);
            return true;
          }),
          catchError(() => {
            authFrontService.logOut();
            return of(false);
          }) // Return false if refresh token fails
        );
      })
    );
  };
}
