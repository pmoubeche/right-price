import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../generated';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../shared/components/dialogs/dialog-generic.service';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
  ],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  readonly NEW_PASSWORD = 'newPassword';
  readonly CONFIRM_PASSWORD = 'confirmPassword';

  resetPasswordForm?: FormGroup;
  token: string = '';

  subscription = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly dialogService: DialogGenericService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.initForm();
  }

  private initForm() {
    this.resetPasswordForm = this.fb.group(
      {
        [this.NEW_PASSWORD]: [
          '',
          [Validators.required, this.passwordPolicyValidator()],
        ],
        [this.CONFIRM_PASSWORD]: ['', [Validators.required]],
      },
      {
        validators: this.passwordsMatchValidator(),
      }
    );
  }

  get newPasswordControl() {
    return this.resetPasswordForm?.get('newPassword')!;
  }

  get confirmPasswordControl() {
    return this.resetPasswordForm?.get('confirmPassword')!;
  }

  passwordPolicyValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) {
        return null;
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

  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(this.NEW_PASSWORD)?.value;
      const confirm = group.get(this.CONFIRM_PASSWORD)?.value;

      if (password === undefined || confirm === undefined) {
        return null;
      }

      return password === confirm ? null : { passwordsDoNotMatch: true };
    };
  }

  modifyPassword(): void {
    if (this.resetPasswordForm?.valid) {
      this.subscription.add(
        this.authService
          .resetPassword({
            token: this.token,
            newPassword: this.newPasswordControl.value,
          })
          .pipe(
            tap(() => {
              this.toastr.success('Mot de passe réinitialisé avec succès');
              this.router.navigate(['/home']);
              this.dialogService.openDialog(CodeModaleEnum.SIGNIN);
            }),
            catchError(() => {
              this.toastr.error('Erreur lors de la réinitialisation');
              return EMPTY;
            })
          )
          .subscribe()
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
