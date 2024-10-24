import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription, switchMap, tap } from 'rxjs';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../../shared/components/dialogs/dialog-generic.service';
import { MaterialModule } from '../../../shared/material/material.module';
import { UserModel } from '../../../shared/model/user.model';
import { ContextService } from '../../../shared/services/context.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthServiceFront } from '../../../shared/services/auth-front.service';
import { SubscriptionService } from '../../../../generated';

@Component({
  selector: 'app-account-edit',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.scss',
})
export class AccountEditComponent implements OnInit {
  readonly NEW_PASSWORD_FIELD = 'newPassword';
  readonly CONFIRM_PASSWORD_FIELD = 'confirmPassword';
  readonly DATE_CREATION = 'dateCreation';

  currentUserId?: string;

  @Input() set user(user: UserModel) {
    if (user) {
      this._user = user;
      this.initForm();
    }
  }

  get user() {
    return this._user!;
  }

  private _user = new UserModel();
  passwordChangeForm!: FormGroup;

  subscription = new Subscription();

  get newPasswordControl(): FormControl {
    return this.passwordChangeForm?.get(this.NEW_PASSWORD_FIELD) as FormControl;
  }

  get confirmPasswordControl(): FormControl {
    return this.passwordChangeForm?.get(
      this.CONFIRM_PASSWORD_FIELD
    ) as FormControl;
  }

  get dateCreationControl(): FormControl {
    return this.passwordChangeForm?.get(this.DATE_CREATION) as FormControl;
  }

  hidePassword = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snackbarService: SnackbarService,
    private readonly userService: UserService,
    private readonly contextService: ContextService,
    private readonly authServiceFront: AuthServiceFront,
    private readonly subscriptionService: SubscriptionService,
    private readonly dialogService: DialogGenericService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.passwordChangeForm = this.formBuilder.group({
      [this.NEW_PASSWORD_FIELD]: [''],
      [this.CONFIRM_PASSWORD_FIELD]: [''],
      [this.DATE_CREATION]: [{ value: this.user.dateCreation, disabled: true }],
    });
  }

  showPassword(event: MouseEvent) {
    this.hidePassword = !this.hidePassword;
    event.stopPropagation();
  }

  modifyPassword(): void {
    if (this.newPasswordControl.value !== this.confirmPasswordControl.value) {
      this.snackbarService.show(
        'Les mots de passes renseignés ne sont pas égaux'
      );
    } else {
      this.subscription.add(
        this.contextService
          .getCurrentUser()
          .pipe(
            switchMap((userRes) =>
              this.userService
                .updatePassword({
                  password: this.confirmPasswordControl.value,
                  userId: userRes?.id,
                })
                .pipe(
                  tap(() => {
                    this.newPasswordControl.reset();
                    this.confirmPasswordControl.reset();
                    this.snackbarService.show(
                      'Mot de passe modifié avec succes'
                    );
                  })
                )
            )
          )
          .subscribe()
      );
    }
  }

  openPopInDeleteAccount(): void {
    this.subscription.add(
      this.contextService
        .getCurrentUser()
        .pipe(
          tap((userRes) => {
            this.dialogService.openDialog(
              CodeModaleEnum.DELETE_ACCOUNT,
              userRes
            );
          })
        )
        .subscribe()
    );
  }

  openPopInUnsubscribe(): void {
    this.subscription.add(
      this.contextService
        .getCurrentUser()
        .pipe(
          tap((userRes) => {
            this.dialogService.openDialog(CodeModaleEnum.UNSUBSCRIBE, userRes);
          })
        )
        .subscribe()
    );
  }
}
