import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountEditService {
  public isDeleteAccountButtonLoadingBs = new BehaviorSubject<boolean>(false);
  public isDeleteAccountButtonLoading$ =
    this.isDeleteAccountButtonLoadingBs.asObservable();

  public isUnsubsribeButtonLoadingBs = new BehaviorSubject<boolean>(false);
  public isUnsubsribeButtonLoading$ =
    this.isUnsubsribeButtonLoadingBs.asObservable();

  constructor() {}
}
