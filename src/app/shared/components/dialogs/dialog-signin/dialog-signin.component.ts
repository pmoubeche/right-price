import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subscription, catchError, of, tap } from 'rxjs';
import { AuthService, RefreshTokenResponse } from '../../../../../generated';
import { MaterialModule } from '../../../material/material.module';
import { AuthServiceFront } from '../../../services/auth-front.service';
import { LoginGoogleComponent } from '../../toolbar/login-google/login-google.component';
import { DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';

@Component({
  standalone: true,
  selector: 'app-dialog-signin',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TablerIconsModule,
    LoginGoogleComponent,
  ],
  templateUrl: './dialog-signin.component.html',
})
export class DialogSigninComponent implements OnInit, OnDestroy {
  readonly EMAIL_INPUT = 'email';
  readonly PASSWORD_INPUT = 'password';

  signinForm?: FormGroup;

  get emailControl(): FormControl {
    return this.signinForm?.get(this.EMAIL_INPUT) as FormControl;
  }

  get passwordControl(): FormControl {
    return this.signinForm?.get(this.PASSWORD_INPUT) as FormControl;
  }

  subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogGenericService: DialogGenericService,
    private readonly authService: AuthService,
    private readonly authServiceFront: AuthServiceFront,
    private readonly snackbarService: ToastrService,
    private readonly formBuilderIn: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signinForm = this.formBuilderIn.group({
      [this.EMAIL_INPUT]: ['', [Validators.email, Validators.required]],
      [this.PASSWORD_INPUT]: ['', [Validators.required, Validators.min(3)]],
    });
  }

  signIn(): void {
    if (this.signinForm?.valid) {
      this.subscription.add(
        this.authService
          .loginWithEmail({
            email: this.emailControl.value,
            password: this.passwordControl.value,
          })
          .pipe(
            tap((res) => {
              this.loginAndClosePopUp(res);
            }),
            catchError(() => {
              return of(EMPTY);
            })
          )
          .subscribe()
      );
    }
  }

  public loginAndClosePopUp(res: RefreshTokenResponse): void {
    this.authServiceFront.logIn(res);
    this.snackbarService.success('Vous etes connecté');
    this.dialogGenericService.close(CodeModaleEnum.SIGNIN, res);
  }

  redirectSignUpPopin(event: any): void {
    event?.preventDefault();
    this.dialogGenericService.close(CodeModaleEnum.SIGNIN);
    setTimeout(() => {
      this.dialogGenericService.openDialog(CodeModaleEnum.SIGNUP);
    }, 100);
  }

  redirectResetPasswordPopin(event: any): void {
    event?.preventDefault();
    this.dialogGenericService.close(CodeModaleEnum.SIGNIN);
    this.dialogGenericService.openDialog(CodeModaleEnum.RESET_PASSWORD);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
