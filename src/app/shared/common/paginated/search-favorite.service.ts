import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  FavoriteFilterModel,
  FavoriteModel,
  FavoriteService,
  GetFavoriteResponseModel,
} from '../../../../generated';
import { Page, PageRequest } from './page';

@Injectable({
  providedIn: 'root',
})
export class SearchFavoriteService {
  constructor(private readonly favoriteService: FavoriteService) {}

  page(
    request: PageRequest<FavoriteModel>,
    favoriteFilterModel: FavoriteFilterModel
  ): Observable<Page<FavoriteModel>> {
    return this.favoriteService
      .getFavorites(
        request.page,
        request.size,
        request.sort?.property!,
        request.sort?.order!,
        favoriteFilterModel
      )
      .pipe(
        switchMap((response: GetFavoriteResponseModel) => {
          if (response) {
            return of({
              content: response.favorites!,
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
