import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'ngx-avatars';
import { Subscription, tap } from 'rxjs';
import { RoleAdmin } from '../../constants/role.constant';
import { MaterialModule } from '../../material/material.module';
import { UserResponse } from '../../model/payload/response/user-reponse.model';
import { RoleModel } from '../../model/role.model';
import { AuthServiceFront } from '../../services/auth-front.service';
import { ContextService } from '../../services/context.service';
import { SnackbarService } from '../../services/snackbar.service';
import {
  ButtonAction,
  DialogContentModel,
} from '../dialogs/dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialogs/dialog-generic.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MaterialModule,
    AvatarModule,
    CommonModule,
    HttpClientModule,
    RouterLink,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  public user$ = this.contextService.getCurrentUser();

  roleAdmin = RoleAdmin;

  public userResponse?: UserResponse;
  subscription = new Subscription();

  constructor(
    private readonly popInService: DialogGenericService,
    private readonly contextService: ContextService,
    private readonly snackbarService: SnackbarService,
    private readonly authService: AuthServiceFront
  ) {}

  private buttonsDialog: ButtonAction[] = [
    {
      isCloseButton: true,
      label: 'Fermer',
    },
  ];

  private dialogParamDataSignin: DialogContentModel = {
    title: 'Se Connecter',
    message: '',
    buttons: this.buttonsDialog,
  };

  private dialogParamDataSignup: DialogContentModel = {
    title: 'Créer un compte',
    message: '',
    buttons: this.buttonsDialog,
  };

  signIn() {
    const dialRef = this.popInService.openDialog(
      CodeModaleEnum.SINGIN,
      this.dialogParamDataSignin
    );

    this.subscription.add(
      dialRef
        .afterClosed()
        .pipe(
          tap((userRes) => {
            this.authService.logIn(userRes);
            this.snackbarService.show('Vous etes connecté');
          })
        )
        .subscribe()
    );
  }

  signUp() {
    const dialRef = this.popInService.openDialog(
      CodeModaleEnum.SIGNUP,
      this.dialogParamDataSignup
    );

    this.subscription.add(
      dialRef
        .afterClosed()
        .pipe(
          tap((userRes) => {
            this.authService.logIn(userRes);
            this.snackbarService.show('Vous etes connecté');
          })
        )
        .subscribe()
    );
  }

  logOut(): void {
    this.authService.logOut();
    this.snackbarService.show('Vous êtes déconnecté');
  }

  hasUserAdminRole(roles?: RoleModel[]): boolean {
    return roles!.find((role) => role.id === RoleAdmin.id) ? true : false;
  }
}
