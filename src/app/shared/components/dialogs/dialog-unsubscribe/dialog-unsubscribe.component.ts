import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, switchMap, tap } from 'rxjs';
import {
  RefreshTokenService,
  SubscriptionService,
} from '../../../../../generated';
import { MaterialModule } from '../../../material/material.module';
import { ContextService } from '../../../services/context.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ButtonAction, DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';
import { TokenStorageService } from '../../../services/token-storage.service';
import { AuthServiceFront } from '../../../services/auth-front.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-unsubscribe',
  imports: [MaterialModule],
  templateUrl: './dialog-unsubscribe.component.html',
})
export class DialogUnsubscribeComponent implements OnInit {
  subscription = new Subscription();
  private buttonsDialog: ButtonAction[] = [
    {
      isCloseButton: true,
      label: 'Fermer',
    },
    {
      isIntialyFocused: true,
      label: 'Se déabonner',
      color: 'danger',
      icon: 'unsubscribe',
    },
  ];

  private dialogParamData: DialogContentModel = {
    title: 'Attention',
    message:
      'Vous êtes sur le point de vous désabonner, êtes vous sûr de vouloir continuer ?',
    buttons: this.buttonsDialog,
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogService: DialogGenericService,
    private readonly contextService: ContextService,
    private readonly snackbarService: ToastrService,
    private readonly subscriptionService: SubscriptionService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly tokenService: TokenStorageService,
    private readonly authFrontService: AuthServiceFront
  ) {}

  ngOnInit(): void {
    this.data = this.dialogParamData;
  }

  unsubscribe(): void {
    this.subscription.add(
      this.contextService
        .getCurrentUser()
        .pipe(
          switchMap((userRes) =>
            this.subscriptionService.unsubscribe(userRes?.id!).pipe(
              tap(() => {
                this.dialogService.close(CodeModaleEnum.UNSUBSCRIBE);
                this.refreshTokenService
                  .refreshToken(this.tokenService.setRefreshTokenRequest(true))
                  .pipe(
                    tap((rtr) => {
                      this.authFrontService.logIn(rtr);
                    })
                  );
                this.snackbarService.success(
                  'Votre désabonnement à été effectué avec succés'
                );
              })
            )
          )
        )
        .subscribe()
    );
  }
}
