import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RefreshTokenResponse } from '../../../generated';
import { ContextService } from './context.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthServiceFront {
  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenStorageService,
    private readonly contextService: ContextService,
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
}
