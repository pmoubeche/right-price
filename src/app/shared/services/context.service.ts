import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserResponse } from '../../../generated';

@Injectable({ providedIn: 'root' })
export class ContextService {
  private currentUser$ = new BehaviorSubject<UserResponse | null>(null);

  getCurrentUser(): Observable<UserResponse | null> {
    return this.currentUser$.asObservable();
  }

  setCurrentUser(user: UserResponse | null): void {
    this.currentUser$.next(user);
  }

  updateCurrentUser(user: UserResponse | null): void {
    this.currentUser$.next(user);
  }

  unsetCurrentUser(): void {
    this.currentUser$.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.getValue() ? of(true) : of(false);
  }
}
