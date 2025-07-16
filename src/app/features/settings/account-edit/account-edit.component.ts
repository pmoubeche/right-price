import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Subscription, switchMap, tap } from 'rxjs';
import {
  RefreshTokenService,
  SubscriptionService,
  UserModel,
  UserService,
} from '../../../../generated';
import { DialogConfirmContentModel } from '../../../shared/components/dialogs/dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../../shared/components/dialogs/dialog-generic.service';
import { MaterialModule } from '../../../shared/material/material.module';
import { AuthServiceFront } from '../../../shared/services/auth-front.service';
import { ContextService } from '../../../shared/services/context.service';
import { RoleUtils } from '../../../shared/utils/role.utils';
import { AccountEditService } from './account-edit.service';
import { TokenStorageService } from '../../../shared/services/token-storage.service';

@Component({
  selector: 'app-account-edit',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: './account-edit.component.html',
})
export class AccountEditComponent implements OnInit {
  readonly OLD_PASSWORD_FIELD = 'oldPassword';
  readonly NEW_PASSWORD_FIELD = 'newPassword';

  currentUserId?: string;

  roleMax?: string;

  @Input() set user(user: UserModel) {
    if (user) {
      this._user = user;
      this.initForm();
      this.roleMax = RoleUtils.getHighestRoleFromRoles(user.roles!).code;
    }
  }

  get user() {
    return this._user!;
  }

  private _user?: UserModel;
  passwordChangeForm!: FormGroup;

  subscription = new Subscription();

  get oldPasswordControl(): FormControl {
    return this.passwordChangeForm?.get(this.OLD_PASSWORD_FIELD) as FormControl;
  }

  get newPasswordControl(): FormControl {
    return this.passwordChangeForm?.get(this.NEW_PASSWORD_FIELD) as FormControl;
  }

  hideOldPassword = true;
  hideNewPassword = true;

  public isDeleteAccountButtonLoading$ =
    this.userAccountService.isDeleteAccountButtonLoadingBs.asObservable();

  public isUnsubsribeButtonLoading$ =
    this.userAccountService.isUnsubsribeButtonLoadingBs.asObservable();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly snackbarService: ToastrService,
    private readonly userService: UserService,
    private readonly contextService: ContextService,
    private readonly dialogService: DialogGenericService,
    private readonly userAccountService: AccountEditService,
    private readonly authServiceFront: AuthServiceFront,
    private readonly subscriptionService: SubscriptionService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly tokenService: TokenStorageService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.passwordChangeForm = this.formBuilder.group(
      {
        [this.OLD_PASSWORD_FIELD]: ['', Validators.required],
        [this.NEW_PASSWORD_FIELD]: [
          '',
          [Validators.required, this.passwordPolicyValidator()],
        ],
      },
      {
        validators: this.differentPasswordsValidator(
          this.OLD_PASSWORD_FIELD,
          this.NEW_PASSWORD_FIELD
        ),
      }
    );
  }

  passwordPolicyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;

      if (!value) {
        return null; // Pas d'erreur si pas de valeur (valide ou non selon ton form)
      }

      const minLength = value.length >= 9;
      const hasUppercase = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);

      const isValid = minLength && hasUppercase && hasNumber;

      return isValid
        ? null
        : {
            passwordPolicy: {
              hasMinLength: minLength,
              hasUppercase,
              hasNumber,
            },
          };
    };
  }

  differentPasswordsValidator(
    oldPasswordKey: string,
    newPasswordKey: string
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const oldPassword = group.get(oldPasswordKey)?.value;
      const newPassword = group.get(newPasswordKey)?.value;

      if (oldPassword && newPassword && oldPassword === newPassword) {
        return { passwordsMatch: true };
      }
      return null;
    };
  }

  modifyPassword(): void {
    this.passwordChangeForm.markAllAsTouched();
    if (this.passwordChangeForm.valid) {
      this.subscription.add(
        this.userService
          .updatePassword({
            oldPassword: this.oldPasswordControl.value,
            newPassword: this.newPasswordControl.value,
          })
          .pipe(
            tap(() => {
              this.oldPasswordControl.reset();
              this.newPasswordControl.reset();
              this.snackbarService.success('Mot de passe modifié avec succes');
            })
          )
          .subscribe()
      );
    }
  }

  openPopInDeleteAccount(): void {
    const config: DialogConfirmContentModel = {
      color: 'error',
      icon: 'device-desktop-x',
      isLoading$: this.isDeleteAccountButtonLoading$,
      title: 'Attention',
      message:
        'Vous êtes sur le point de supprimer votre compte, toutes les données contenues seront également supprimées, êtes vous sûr de vouloir continuer ?',
      confirm: () => this.deleteAccount(),
    };
    this.dialogService.openConfirmDialog(config);
  }

  deleteAccount(): void {
    this.userAccountService.isDeleteAccountButtonLoadingBs.next(true);
    this.subscription.add(
      this.contextService
        .getCurrentUser()
        .pipe(
          switchMap((userRes) =>
            this.userService.deleteAccount(userRes?.id!).pipe(
              tap(() => {
                this.userAccountService.isDeleteAccountButtonLoadingBs.next(
                  false
                );
                this.snackbarService.success('Votre compte a été supprimé !');
                this.authServiceFront.logOut();
              })
            )
          )
        )
        .subscribe()
    );
  }

  openPopInUnsubscribe(): void {
    const config: DialogConfirmContentModel = {
      color: 'error',
      icon: 'user-minus',
      isLoading$: this.isUnsubsribeButtonLoading$,
      title: 'Attention',
      message:
        'Vous êtes sur le point de vous désabonner, êtes vous sûr de vouloir continuer ?',
      confirm: () => this.unsubscribe(),
    };
    this.dialogService.openConfirmDialog(config);
  }

  unsubscribe(): void {
    this.subscription.add(
      this.contextService
        .getCurrentUser()
        .pipe(
          switchMap((userRes) =>
            this.subscriptionService.unsubscribe(userRes?.id!).pipe(
              switchMap(() =>
                this.refreshTokenService.refreshToken(
                  this.tokenService.setRefreshTokenRequest(true)
                )
              ),
              tap((rtr) => {
                this.authServiceFront.logIn(rtr);
                this.snackbarService.success(
                  'Votre désabonnement a été effectué avec succès'
                );
              })
            )
          ),
          catchError((err) => {
            this.snackbarService.error('Erreur lors du désabonnement');
            return EMPTY;
          })
        )
        .subscribe()
    );
  }

  redirectToSubscribe(): void {
    this.router.navigate(['/subscribe']);
  }
}
