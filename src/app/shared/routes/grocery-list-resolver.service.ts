import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { MealsService } from '../../../generated';

export const getListDatesWhereMealsResolver: ResolveFn<Object> = (
  route,
  state
) => {
  return inject(MealsService).getDatesMealsFromUser();
};
