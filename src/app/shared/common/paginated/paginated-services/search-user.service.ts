import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Page, PageRequest } from '../page';
import {
  GetUserResponseModel,
  UserFilterModel,
  UserModel,
  UserService,
} from '../../../../../generated';

@Injectable({
  providedIn: 'root',
})
export class SearchUserService {
  constructor(private readonly userService: UserService) {}

  page(
    request: PageRequest<UserModel>,
    userFilterModel: UserFilterModel
  ): Observable<Page<UserModel>> {
    return this.userService
      .getUsers(
        request.page,
        request.size,
        request.sort?.property!,
        request.sort?.order!,
        userFilterModel
      )
      .pipe(
        switchMap((response: GetUserResponseModel) => {
          if (response) {
            return of({
              content: response.users!,
              number: response.size!,
              size: response.totalPages!,
              totalElements: response.totalElements!,
            });
          } else {
            return of({
              content: [],
              number: request.page,
              size: 0,
              totalElements: 0,
            });
          }
        }),
        catchError(() => {
          return of({
            content: [],
            number: request.page,
            size: 0,
            totalElements: 0,
          });
        })
      );
  }
}
