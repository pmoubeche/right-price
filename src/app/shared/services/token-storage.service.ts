import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserResponse } from '../model/payload/response/user-reponse.model';
import { SnackbarService } from './snackbar.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  readonly TOKEN_EXPIRATION_MIN = 60;

  constructor(
    private readonly router: Router,
    private readonly snackbarService: SnackbarService
  ) {}

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.sessionStorage.getItem(TOKEN_KEY)!;
  }

  public saveUser(user: UserResponse): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): UserResponse | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return JSON.parse(sessionStorage.getItem(USER_KEY)!);
  }

  public isTokenExpired(): boolean {
    if (typeof window === 'undefined') {
      return true;
    }

    return jwtDecode(this.getAccessToken()!).exp! > Date.now();
  }

  public setTokenExpiration() {
    setTimeout(() => {
      this.signOut();
      this.router.navigate(['/home']);
      this.snackbarService.show('Vous avez été déconnecté');
    }, 1000 * 60 * this.TOKEN_EXPIRATION_MIN);
  }
}
