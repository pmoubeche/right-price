import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserResponse } from '../model/user-reponse.model';
import { Observable } from 'rxjs';
import { environment } from '../../env-dev';
import { TokenStorageService } from './token-storage.service';
import { ContextService } from './context.service';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { User } from '../model/user.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private readonly router: Router,
    private readonly tokenService: TokenStorageService,
    private readonly contextService: ContextService,
    private readonly snackbarService: SnackbarService
  ) {}

  getUserByEmailAdress(email: string): Observable<UserResponse> {
    return this.http.get(
      environment.API.GET_USER_BY_EMAIL + `/${email}`,
      httpOptions
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get(environment.API.USER + `/${id}`, httpOptions);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put(environment.API.USER, user, httpOptions);
  }

  logIn(userResponse: UserResponse): void {
    this.tokenService.saveToken(userResponse.accessToken!);
    this.tokenService.saveUser(userResponse);
    this.contextService.setCurrentUser(userResponse);
    this.tokenService.setTokenExpiration();
    this.snackbarService.show('Vous etes connecté');
  }

  logOut(): void {
    this.tokenService.signOut();
    this.contextService.unsetCurrentUser();
    this.router.navigate(['/home']);
  }
}
