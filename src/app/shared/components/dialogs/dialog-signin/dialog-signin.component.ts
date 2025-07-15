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
import { EMPTY, Subscription, catchError, of, tap } from 'rxjs';
import { MaterialModule } from '../../../material/material.module';
import { AuthServiceFront } from '../../../services/auth-front.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { LoginGoogleComponent } from '../../toolbar/login-google/login-google.component';
import { ButtonAction, DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';
import { AuthService, RefreshTokenResponse } from '../../../../../generated';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dialog-signin',
  imports: [
    MaterialModule,
    LoginGoogleComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './dialog-signin.component.html',
  styleUrl: './dialog-signin.component.scss',
})
export class DialogSigninComponent implements OnInit, OnDestroy {
  readonly EMAIL_INPUT = 'email';
  readonly PASSWORD_INPUT = 'password';

  signinForm?: FormGroup;
  isDisplaySigninForm = false;
  isEmailPasswordIncorrect = false;

  get emailControl(): FormControl {
    return this.signinForm?.get(this.EMAIL_INPUT) as FormControl;
  }

  get passwordControl(): FormControl {
    return this.signinForm?.get(this.PASSWORD_INPUT) as FormControl;
  }

  private buttonsDialog: ButtonAction[] = [
    {
      isCloseButton: true,
      label: 'Fermer',
    },
  ];

  public dialogParamDataSignin: DialogContentModel = {
    title: 'Se Connecter',
    message: '',
    buttons: this.buttonsDialog,
  };

  subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogGenericService: DialogGenericService,
    private readonly authService: AuthService,
    private readonly authServiceFront: AuthServiceFront,
    private readonly snackbarService: ToastrService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.isEmailPasswordIncorrect = false;
    this.initForm();
  }

  initForm(): void {
    this.signinForm = this.formBuilder.group({
      [this.EMAIL_INPUT]: ['', [Validators.email, Validators.required]],
      [this.PASSWORD_INPUT]: ['', [Validators.required, Validators.min(3)]],
    });
  }

  onSigninWithEmailButton() {
    this.isDisplaySigninForm = true;
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
              this.isEmailPasswordIncorrect = true;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
