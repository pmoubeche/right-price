import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
  RefreshTokenService,
} from '../../../generated';
import { ContextService } from './context.service';
import { TokenStorageService } from './token-storage.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthServiceFront {
  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenStorageService,
    private readonly contextService: ContextService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly toastr: ToastrService
  ) {}

  logIn(rtResponse: RefreshTokenResponse): void {
    this.tokenService.saveRefreshTokenResponseInLocalStorage(rtResponse);
    this.contextService.setCurrentUser(
      this.tokenService.getCurrentUserFromToken()
    );
  }

  logOut = () => {
    this.tokenService.signOut();
    this.contextService.unsetCurrentUser();
    this.toastr.success('Vous avez été déconnecté');
    this.router.navigate(['/home']);
  };

  checkOrRefreshToken(): Observable<boolean> {
    return this.contextService.isAuthenticated().pipe(
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return of(false);
        }

        if (!this.tokenService.isAccessTokenExpired()) {
          return of(true);
        }

        const refreshTokenModel: RefreshTokenRequest =
          this.tokenService.setRefreshTokenRequest();

        return this.refreshTokenService.refreshToken(refreshTokenModel).pipe(
          map((response: RefreshTokenResponse) => {
            if (response.refreshToken === this.tokenService.getRefreshToken()) {
              return true;
            }
            this.tokenService.saveRefreshTokenResponseInLocalStorage(response);
            return true;
          }),
          catchError(() => {
            this.logOut();
            return of(false);
          })
        );
      })
    );
  }
}
