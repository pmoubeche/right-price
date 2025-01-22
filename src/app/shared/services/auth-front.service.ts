import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RefreshTokenResponse } from '../../../generated';
import { ContextService } from './context.service';
import { SnackbarService } from './snackbar.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthServiceFront {
  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenStorageService,
    private readonly contextService: ContextService,
    private readonly snackbarService: SnackbarService
  ) {}

  logIn(rtResponse: RefreshTokenResponse): void {
    this.tokenService.saveAccessToken(rtResponse.accessToken!);
    this.tokenService.saveRefreshToken(rtResponse.refreshToken!);
    this.tokenService.saveExpirationDate(rtResponse.expiresAt!);

    this.contextService.setCurrentUser(
      this.tokenService.getCurrentUserFromToken()
    );
  }

  logOut = () => {
    this.tokenService.signOut();
    this.contextService.unsetCurrentUser();
    this.snackbarService.show('Vous avez été déconnecté');
    this.router.navigate(['/home']);
  };
}
