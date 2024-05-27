import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserResponse } from '../model/user-reponse.model';

@Injectable({ providedIn: 'root' })
export class ContextService {
  private currentUser$ = new BehaviorSubject<UserResponse | null>(null);

  getCurrentUser(): Observable<UserResponse | null> {
    return this.currentUser$.asObservable();
  }

  setCurrentUser(user: UserResponse | null): void {
    this.currentUser$.next(user);
  }

  unsetCurrentUser(): void {
    this.currentUser$.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUser$.getValue() ? true : false;
  }
}
