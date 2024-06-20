import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { CgmImportService } from '../../../generated';

export const getListDatesWhereCgmResolver: ResolveFn<Object> = (
  route,
  state
) => {
  return inject(CgmImportService).getDatesCgmFromUser();
};
