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
import { Subscription, tap } from 'rxjs';
import { MaterialModule } from '../../../material/material.module';
import { AuthServiceFront } from '../../../services/auth-front.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { LoginGoogleComponent } from '../../toolbar/login-google/login-google.component';
import { ButtonAction, DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';
import {
  AuthService,
  RefreshTokenResponse,
  UserRequest,
} from '../../../../../generated';

@Component({
    selector: 'app-dialog-signup',
    imports: [
        MaterialModule,
        LoginGoogleComponent,
        ReactiveFormsModule,
        FormsModule,
    ],
    templateUrl: './dialog-signup.component.html',
    styleUrl: './dialog-signup.component.scss'
})
export class DialogSignupComponent implements OnInit, OnDestroy {
  readonly USERNAME_INPUT = 'username';
  readonly EMAIL_INPUT = 'email';
  readonly PASSWORD_INPUT = 'password';

  signupForm?: FormGroup;
  isDisplaySignupForm = false;

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

  get usernameControl(): FormControl {
    return this.signupForm?.get(this.USERNAME_INPUT) as FormControl;
  }
  get emailControl(): FormControl {
    return this.signupForm?.get(this.EMAIL_INPUT) as FormControl;
  }

  get passwordControl(): FormControl {
    return this.signupForm?.get(this.PASSWORD_INPUT) as FormControl;
  }

  subscription = new Subscription();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly authService: AuthService,
    private readonly dialogGenericService: DialogGenericService,
    private readonly snackbarService: SnackbarService,
    private readonly authServiceFront: AuthServiceFront,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.formBuilder.group({
      [this.USERNAME_INPUT]: ['', [Validators.required]],
      [this.EMAIL_INPUT]: ['', [Validators.required]],
      [this.PASSWORD_INPUT]: ['', [Validators.required]],
    });
  }

  onSignupWithEmailButton() {
    this.isDisplaySignupForm = true;
  }

  signUp(): void {
    const userRequest: UserRequest = {
      email: this.emailControl.value,
      username: this.usernameControl.value,
      password: this.passwordControl.value,
      image: 'assets/svg/avatars/boy.png',
    };

    if (this.signupForm?.valid) {
      this.subscription.add(
        this.authService
          .registerWithEmail(userRequest)
          .pipe(
            tap((res) => {
              this.loginAndClosePopUp(res);
            })
          )
          .subscribe()
      );
    }
  }

  public loginAndClosePopUp(res: RefreshTokenResponse): void {
    this.authServiceFront.logIn(res);
    this.snackbarService.show('Utilisateur créé avec succes');
    this.dialogGenericService.close(CodeModaleEnum.SIGNUP, res);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
