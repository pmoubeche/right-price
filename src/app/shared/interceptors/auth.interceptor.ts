import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../env-dev';
import { AuthServiceFront } from '../services/auth-front.service';
import { TokenStorageService } from '../services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const tokenService = inject(TokenStorageService);
  const snackbarService = inject(ToastrService);
  const authFrontService = inject(AuthServiceFront);
  const baseUrl = environment.API.BASE_SERVER_URL;

  const requiresAuth =
    req.url.startsWith(baseUrl) &&
    !Object.values(environment.NON_AUTH_API).includes(req.url);

  if (!requiresAuth) {
    return next(req); // Pas besoin de token
  }

  return authFrontService.checkOrRefreshToken().pipe(
    switchMap((isValid) => {
      if (!isValid) {
        snackbarService.error(
          'Votre session a expiré. Veuillez vous reconnecter.'
        );
        router.navigate(['/home']);
        return throwError(() => new Error('Non authentifié'));
      }

      const accessToken = tokenService.getAccessToken();
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
      return next(cloned);
    }),
    catchError((err) => {
      return throwError(() => err);
    })
  );
};
