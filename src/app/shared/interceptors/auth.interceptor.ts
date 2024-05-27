import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../env-dev';
import { SnackbarService } from '../services/snackbar.service';
import { TokenStorageService } from '../services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const tokenService = inject(TokenStorageService);
  const snackbarService = inject(SnackbarService);
  const accessToken = tokenService.getAccessToken();

  if (accessToken && req.url.startsWith(environment.API.BASE_SERVER_URL)) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(req).pipe(
    catchError(
      (erreur: HttpErrorResponse, event: Observable<HttpEvent<unknown>>) => {
        if (
          erreur.status === HttpStatusCode.Unauthorized ||
          erreur.status === HttpStatusCode.Forbidden
        ) {
          snackbarService.show(
            "Vous n'êtes pas autorisé à effectuer cette action. Veuillez vous connecter pour pouvoir y acceder"
          );
          router.navigate(['/home']);
        }

        return throwError(() => erreur);
      }
    )
  );
};
