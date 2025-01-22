import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { RolesConstants } from '../constants/role.constant';
import { UserResponse } from '../../../generated';

const TOKEN_KEY = 'accesstoken';
const REFRESH_TOKEN = 'refreshToken';
const EXP = 'exp';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  readonly TOKEN_EXPIRATION_MIN = 60;

  constructor() {}

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveAccessToken(accessToken: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, accessToken);
  }

  public saveRefreshToken(refreshToken: string): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN);
    window.sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
  }

  public saveExpirationDate(exp: string): void {
    window.sessionStorage.removeItem(EXP);
    window.sessionStorage.setItem(EXP, exp);
  }

  public getAccessToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.sessionStorage.getItem(TOKEN_KEY)!;
  }

  public getRefreshToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.sessionStorage.getItem(REFRESH_TOKEN)!;
  }

  public getExpiresAt(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return window.sessionStorage.getItem(EXP)!;
  }

  getCurrentUserFromToken(): UserResponse {
    return {
      id: this.getUserIdFromToken(),
      roles: RolesConstants.filter((role) =>
        this.getRolesFromToken().includes(role.id!)
      ),
      image: this.getImageUrlFromToken(),
      username: this.getUsernameFromToken(),
    } as UserResponse;
  }

  public isAccessTokenExpired(): boolean {
    return Date.parse(this.getExpiresAt()!) < Date.now();
  }

  public getImageUrlFromToken(): string {
    var token: any = jwtDecode(this.getAccessToken()!);
    return token['img'];
  }

  public getUserIdFromToken(): string {
    var token: any = jwtDecode(this.getAccessToken()!);
    return token['id'];
  }

  public getUsernameFromToken(): string {
    var token: any = jwtDecode(this.getAccessToken()!);
    return token['sub'];
  }

  public getRolesFromToken(): string[] {
    var token: any = jwtDecode(this.getAccessToken()!);
    return token['roles'];
  }
}
