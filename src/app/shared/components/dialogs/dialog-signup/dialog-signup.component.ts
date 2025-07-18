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
import { Subscription, tap } from 'rxjs';
import {
  AuthService,
  RefreshTokenResponse,
  UserRequest,
} from '../../../../../generated';
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
  selector: 'app-dialog-signup',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TablerIconsModule,
    LoginGoogleComponent,
  ],
  templateUrl: './dialog-signup.component.html',
})
export class DialogSignupComponent implements OnInit, OnDestroy {
  readonly USERNAME_INPUT = 'username';
  readonly EMAIL_INPUT = 'email';
  readonly PASSWORD_INPUT = 'password';

  signupForm?: FormGroup;

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
    private readonly dialogGenericService: DialogGenericService,
    private readonly authService: AuthService,
    private readonly authServiceFront: AuthServiceFront,
    private readonly snackbarService: ToastrService,
    private readonly formBuilderUp: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signupForm = this.formBuilderUp.group({
      [this.USERNAME_INPUT]: ['', [Validators.required]],
      [this.EMAIL_INPUT]: ['', [Validators.email, Validators.required]],
      [this.PASSWORD_INPUT]: ['', [Validators.required, Validators.min(3)]],
    });
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
    this.snackbarService.success('Utilisateur créé avec succes');
    this.dialogGenericService.close(CodeModaleEnum.SIGNUP, res);
  }

  redirectSignInPopin(event: any): void {
    event?.preventDefault();
    this.dialogGenericService.close(CodeModaleEnum.SIGNUP);
    setTimeout(() => {
      this.dialogGenericService.openDialog(CodeModaleEnum.SIGNIN);
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
