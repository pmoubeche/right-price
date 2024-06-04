import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Page, PageRequest } from '../page';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/user.model';
import { UserFilterModel } from '../../../model/payload/request/user-filter.model';
import { GetUsersModelResponse } from '../response/get-users-model-response.model';

@Injectable({
  providedIn: 'root',
})
export class SearchUserService {
  constructor(private readonly userService: UserService) {}

  page(
    request: PageRequest<User>,
    userFilterModel: UserFilterModel
  ): Observable<Page<User>> {
    return this.userService
      .getUsers(
        request.page,
        request.size,
        request.sort?.property!,
        request.sort?.order!,
        userFilterModel
      )
      .pipe(
        switchMap((response: GetUsersModelResponse) => {
          if (response) {
            return of({
              content: response.users!,
              number: response.size!,
              size: response.totalPage!,
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
