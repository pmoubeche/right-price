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
      {
        email: credentials.email,
        password: credentials.password,
      },
      httpOptions
    );
  }

  loginWithGoogle(credentials: AuthGoogleRequest): Observable<UserResponse> {
    return this.http.post(
      environment.API.AUTH_SIGNIN_GOOGLE,
      {
        email: credentials.email,
        idGoogle: credentials.idGoogle,
      },
      httpOptions
    );
  }

  registerWithEmail(user: UserRequest): Observable<UserResponse> {
    return this.http.post(
      environment.API.AUTH_SIGNUP_EMAIL,
      {
        username: user.username,
        email: user.email,
        password: user.password,
        roles: [{ name: 'GUEST_0d7fe874-06e6-4b78-9aec-f1c927801118' }],
      },
      httpOptions
    );
  }

  registerWithGoogle(user: UserGoogleRequest): Observable<UserResponse> {
    return this.http.post(
      environment.API.AUTH_SIGNUP_GOOGLE,
      {
        idGoogle: user.idGoogle,
        familyName: user.familyName,
        givenName: user.givenName,
        emailverified: user.emailVerified,
        sessionExpiration: user.sessionExpiration,
        username: user.username,
        email: user.email,
        roles: [{ name: 'GUEST_0d7fe874-06e6-4b78-9aec-f1c927801118' }],
      },
      httpOptions
    );
  }
}
