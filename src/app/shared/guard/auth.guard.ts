import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../components/dialogs/dialog-generic.service';
import { AuthServiceFront } from '../services/auth-front.service';

export function authGuard(): CanActivateFn {
  return (): Observable<boolean> => {
    const dialogService = inject(DialogGenericService);
    const authFrontService = inject(AuthServiceFront);

    return authFrontService.checkOrRefreshToken().pipe(
      map((isValid) => {
        if (!isValid) {
          dialogService.openDialog(CodeModaleEnum.SIGNIN);
        }
        return isValid;
      })
    );
  };
}
