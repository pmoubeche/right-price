import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserResponse,
} from '../../../generated';
import { RolesConstants } from '../constants/role.constant';

const TOKEN_KEY = 'accesstoken';
const REFRESH_TOKEN = 'refreshToken';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  signOut(): void {
    if (typeof window !== 'undefined') window.sessionStorage.clear();
  }

  public saveAccessToken(accessToken: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, accessToken);
  }

  public saveRefreshToken(refreshToken: string): void {
    window.sessionStorage.removeItem(REFRESH_TOKEN);
    window.sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
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

  setRefreshTokenRequest(forceRenewal?: boolean): RefreshTokenRequest {
    return {
      accessToken: this.getAccessToken()!,
      refreshToken: this.getRefreshToken()!,
      forceRenewal: !forceRenewal ? false : forceRenewal,
    } as RefreshTokenRequest;
  }

  saveRefreshTokenResponseInLocalStorage(response: RefreshTokenResponse): void {
    this.saveAccessToken(response.accessToken!);
    this.saveRefreshToken(response.refreshToken!);
  }

  public isAccessTokenExpired(): boolean {
    return this.getExpFromToken() < Date.now();
  }

  public getImageUrlFromToken(): string {
    var token: any = jwtDecode(this.getAccessToken()!);
    return token['img'];
  }

  public getExpFromToken(): number {
    var token: any = jwtDecode(this.getAccessToken()!);
    return token['exp'] * 1000; // Convert to milliseconds
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
