import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlucoseMonitoringService {
  public isImportButtonLoadingBs = new BehaviorSubject<boolean>(false);
  public isImportButtonLoading$ = this.isImportButtonLoadingBs.asObservable();

  public isDeleteCgmButtonLoadingBs = new BehaviorSubject<boolean>(false);
  public isDeleteCgmButtonLoading$ =
    this.isDeleteCgmButtonLoadingBs.asObservable();
  constructor() {}
}
