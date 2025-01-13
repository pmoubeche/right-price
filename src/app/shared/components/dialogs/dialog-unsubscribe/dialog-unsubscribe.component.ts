import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, switchMap, tap } from 'rxjs';
import { SubscriptionService } from '../../../../../generated';
import { MaterialModule } from '../../../material/material.module';
import { ContextService } from '../../../services/context.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ButtonAction, DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';

@Component({
  selector: 'app-dialog-unsubscribe',
  standalone: true,
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
    private readonly snackbarService: SnackbarService,
    private readonly subscriptionService: SubscriptionService
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
                this.snackbarService.show(
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
