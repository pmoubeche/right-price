import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { ButtonAction, DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';
import { ContextService } from '../../../services/context.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { Subscription, switchMap, tap } from 'rxjs';
import { AuthServiceFront } from '../../../services/auth-front.service';
import { UserService } from '../../../../../generated';

@Component({
    selector: 'app-dialog-delete-account',
    imports: [MaterialModule],
    templateUrl: './dialog-delete-account.component.html'
})
export class DialogDeleteAccountComponent implements OnInit {
  subscription = new Subscription();
  private buttonsDialog: ButtonAction[] = [
    {
      isCloseButton: true,
      label: 'Fermer',
    },
    {
      isIntialyFocused: true,
      label: 'Supprimer',
      color: 'danger',
      icon: 'delete_forever',
    },
  ];

  private dialogParamData: DialogContentModel = {
    title: 'Attention',
    message:
      'Vous êtes sur le point de supprimer votre compte, êtes vous sûr de vouloir continuer ?',
    buttons: this.buttonsDialog,
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogService: DialogGenericService,
    private readonly contextService: ContextService,
    private readonly snackbarService: SnackbarService,
    private readonly authServiceFront: AuthServiceFront,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    this.data = this.dialogParamData;
  }

  deleteAccount(): void {
    this.subscription.add(
      this.contextService
        .getCurrentUser()
        .pipe(
          switchMap((userRes) =>
            this.userService.deleteAccount(userRes?.id!).pipe(
              tap(() => {
                this.dialogService.close(CodeModaleEnum.DELETE_ACCOUNT);
                this.snackbarService.show('Votre compte a été supprimé !');
                this.authServiceFront.logOut();
              })
            )
          )
        )
        .subscribe()
    );
  }
}
