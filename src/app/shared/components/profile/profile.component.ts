import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AvatarModule } from 'ngx-avatars';
import { MaterialModule } from '../../material/material.module';
import { ContextService } from '../../services/context.service';
import { SnackbarService } from '../../services/snackbar.service';
import { TokenStorageService } from '../../services/token-storage.service';
import { UserService } from '../../services/user.service';
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
  imports: [MaterialModule, AvatarModule, CommonModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  public user$ = this.contextService.getCurrentUser();

  constructor(
    private readonly popInService: DialogGenericService,
    private readonly tokenService: TokenStorageService,
    private readonly userService: UserService,
    private readonly contextService: ContextService,
    private readonly snackbarService: SnackbarService,
    private readonly router: Router
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
    this.popInService.openDialog(
      CodeModaleEnum.SINGIN,
      this.dialogParamDataSignin
    );
  }

  signUp() {
    this.popInService.openDialog(
      CodeModaleEnum.SIGNUP,
      this.dialogParamDataSignup
    );
  }

  logOut(): void {
    this.userService.logOut();
    this.snackbarService.show('Vous êtes déconnecté');
  }
}
