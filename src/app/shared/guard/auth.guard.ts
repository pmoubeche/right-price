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

export function authGuard(): CanActivateFn {
  return (
    ars: ActivatedRouteSnapshot,
    rss: RouterStateSnapshot
  ): Observable<boolean> => {
    const tokenService = inject(TokenStorageService);
    const refreshTokenService = inject(RefreshTokenService);
    const contextService = inject(ContextService);

    return contextService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return of(false);
        }

        if (!tokenService.isAccessTokenExpired()) {
          return of(true);
        }

        // Handle token refresh if access token is expired
        const refreshTokenModel: RefreshTokenRequest = {
          accessToken: tokenService.getAccessToken()!,
          refreshToken: tokenService.getRefreshToken()!,
          accessTokenExpiresAt: tokenService.getExpiresAt()!,
        };

        return refreshTokenService.refreshToken(refreshTokenModel).pipe(
          map((response: RefreshTokenResponse) => {
            tokenService.saveAccessToken(response.accessToken!);
            tokenService.saveRefreshToken(response.refreshToken!);
            tokenService.saveExpirationDate(response.expiresAt!);
            return true;
          }),
          catchError(() => of(false)) // Return false if refresh token fails
        );
      })
    );
  };
}
