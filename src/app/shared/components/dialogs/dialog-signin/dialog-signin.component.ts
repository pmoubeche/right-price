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
import { UserResponse } from '../../../model/payload/response/user-reponse.model';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserService } from '../../../services/user.service';
import { LoginGoogleComponent } from '../../toolbar/login-google/login-google.component';
import { DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';

@Component({
  selector: 'app-dialog-signin',
  standalone: true,
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
  isPasswordHidden = true;

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
    private readonly userService: UserService,
    private readonly snackbarService: SnackbarService,
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
            tap((loggedUser) => {
              this.loginAndClosePopUp(loggedUser);
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

  public loginAndClosePopUp(res: UserResponse): void {
    this.userService.logIn(res);
    this.snackbarService.show('Vous etes connecté');
    this.dialogGenericService.close(CodeModaleEnum.SINGIN, res);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
