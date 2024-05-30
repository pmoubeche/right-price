import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from '../../shared/material/material.module';
import { ProfilEditComponent } from './profil-edit/profil-edit.component';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/model/user.model';
import { Subscription, switchMap, tap } from 'rxjs';
import { ContextService } from '../../shared/services/context.service';
import { AccountEditComponent } from './account-edit/account-edit.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterLink,
    MaterialModule,
    ProfilEditComponent,
    AccountEditComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  public currentUser$ = this.contextService.getCurrentUser();
  public user?: User;
  subscription = new Subscription();
  constructor(
    private readonly userService: UserService,
    private readonly contextService: ContextService
  ) {}

  ngOnInit(): void {
    this.getUserInfosFromCurrentUser();
  }

  getUserInfosFromCurrentUser(): void {
    this.subscription.add(
      this.currentUser$
        .pipe(
          switchMap((user) =>
            this.userService.getUserById(user!.id!).pipe(
              tap((userdb) => {
                this.user = userdb;
              })
            )
          )
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
