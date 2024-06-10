import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  BannerFilterModel,
  BannerInfoModel,
  BannerService,
  GetBannerResponseModel,
} from '../../../../../generated';
import { Page, PageRequest } from '../page';

@Injectable({
  providedIn: 'root',
})
export class SearchBannerService {
  constructor(private readonly bannerService: BannerService) {}

  page(
    request: PageRequest<BannerInfoModel>,
    bannerFilterModel: BannerFilterModel
  ): Observable<Page<BannerInfoModel>> {
    return this.bannerService
      .getBanners(
        request.page,
        request.size,
        request.sort?.property!,
        request.sort?.order!,
        bannerFilterModel
      )
      .pipe(
        switchMap((response: GetBannerResponseModel) => {
          if (response) {
            return of({
              content: response.bannersList!,
              number: response.page!,
              size: response.totalPages!,
              totalElements: response.size!,
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
