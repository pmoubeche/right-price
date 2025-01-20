import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from '../../../generated';

export const getUserByIdResolver: ResolveFn<Object> = (route, state) => {
  return inject(UserService).getUserById(route.params['id']);
};
