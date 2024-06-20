import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserResponse } from '../model/payload/response/user-reponse.model';
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

  logIn(userResponse: UserResponse): void {
    this.tokenService.saveToken(userResponse.accessToken!);
    this.tokenService.saveUser(userResponse);
    this.contextService.setCurrentUser(userResponse);
    this.tokenService.setTokenExpiration(this.logOut);
  }

  logOut = () => {
    this.tokenService.signOut();
    this.contextService.unsetCurrentUser();
    this.snackbarService.show('Vous avez été déconnecté');
    this.router.navigate(['/home']);
  };
}
