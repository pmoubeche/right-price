import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../env-dev';
import { AuthRequest } from '../model/auth-request.model';
import { UserResponse } from '../model/user-reponse.model';
import { UserRequest } from '../model/user-request';

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

  login(credentials: AuthRequest): Observable<UserResponse> {
    return this.http.post(
      environment.API.AUTH_SIGNIN,
      {
        email: credentials.email,
        password: credentials.password,
      },
      httpOptions
    );
  }

  register(user: UserRequest): Observable<UserResponse> {
    return this.http.post(
      environment.API.AUTH_SIGNUP,
      {
        username: user.username,
        email: user.email,
        password: user.password,
        roles: [{ name: 'GUEST_0d7fe874-06e6-4b78-9aec-f1c927801118' }],
      },
      httpOptions
    );
  }
}
