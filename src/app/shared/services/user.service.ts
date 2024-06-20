import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { environment } from '../../env-dev';
import { PasswordUpdate } from '../model/payload/request/password-update.model';
import { UserFilterModel } from '../model/payload/request/user-filter.model';
import { UserResponse } from '../model/payload/response/user-reponse.model';
import { UserAdminModel, UserModel } from '../model/user.model';
import { ContextService } from './context.service';
import { TokenStorageService } from './token-storage.service';

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
    private readonly contextService: ContextService
  ) {}

  private toHttpParam(obj: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(obj).forEach(function (key) {
      httpParams = httpParams.append(key, obj[key]);
    });
    return httpParams;
  }

  getUserByEmailAdress(email: string): Observable<UserResponse> {
    return this.http.get(
      environment.API.GET_USER_BY_EMAIL + `/${email}`,
      httpOptions
    );
  }

  getUserById(id: string): Observable<UserModel> {
    return this.http.get(environment.API.USER + `/${id}`, httpOptions);
  }

  getUserAdminById(id: string): Observable<UserAdminModel> {
    return this.http.get(environment.API.USER_BY_ADMIN + `/${id}`, httpOptions);
  }

  getUsers(
    page: number,
    size: number,
    sort: string,
    sortType: string,
    userFilter: UserFilterModel
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', sort)
      .set('sortType', sortType);

    for (const key in userFilter) {
      if (userFilter.hasOwnProperty(key)) {
        //@ts-ignore
        params = params.append(key, userFilter[key]);
      }
    }
    return this.http.get(environment.API.USERS, {
      params,
    });
  }

  updateUser(user: UserResponse): Observable<UserModel> {
    return this.http.put(environment.API.USER, user, httpOptions);
  }

  updateUserByAdmin(user: UserAdminModel): Observable<UserAdminModel> {
    // const encodedUrl = environment.API.USER_BY_ADMIN.replace('-', '%2D');
    return this.http.put(environment.API.USER_BY_ADMIN, user, httpOptions);
  }

  updatePassword(passwordUpdate: PasswordUpdate): Observable<void> {
    return this.http
      .put(environment.API.MODIFY_PASSWORD, passwordUpdate, httpOptions)
      .pipe(map(() => undefined));
  }

  deleteAccount(userId: string): Observable<void> {
    return this.http
      .delete(environment.API.DELETE_ACCOUNT + `/${userId}`)
      .pipe(map(() => undefined));
  }
}
