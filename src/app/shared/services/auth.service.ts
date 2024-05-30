import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../env-dev';
import { AuthRequest } from '../model/auth-request.model';
import { UserResponse } from '../model/user-reponse.model';

import { UserRequest } from '../model/user-request';
import { UserGoogleRequest } from '../model/user-google-request.model';
import { AuthGoogleRequest } from '../model/auth-google-request.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export class UserCredentials {
  username?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  loginWithEmail(credentials: AuthRequest): Observable<UserResponse> {
    return this.http.post(
      environment.API.AUTH_SIGNIN_EMAIL,
      credentials,
      httpOptions
    );
  }

  loginWithGoogle(credentials: AuthGoogleRequest): Observable<UserResponse> {
    return this.http.post(
      environment.API.AUTH_SIGNIN_GOOGLE,
      credentials,
      httpOptions
    );
  }

  registerWithEmail(user: UserRequest): Observable<UserResponse> {
    return this.http.post(environment.API.AUTH_SIGNUP_EMAIL, user, httpOptions);
  }

  registerWithGoogle(user: UserGoogleRequest): Observable<UserResponse> {
    return this.http.post(
      environment.API.AUTH_SIGNUP_GOOGLE,
      user,
      httpOptions
    );
  }
}
