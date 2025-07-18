import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { finalize, Subscription } from 'rxjs';
import { AuthService, PasswordResetRequest } from '../../../../../generated';
import { MaterialModule } from '../../../material/material.module';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogContentModel } from '../dialog-content.model';

@Component({
  standalone: true,
  selector: 'app-dialog-reset-password',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: './dialog-reset-password.component.html',
})
export class DialogResetPasswordComponent implements OnInit, OnDestroy {
  readonly EMAIL_INPUT = 'email';

  resetPasswordForm?: FormGroup;

  requestSend = false;

  get emailControl(): FormControl {
    return this.resetPasswordForm?.get(this.EMAIL_INPUT) as FormControl;
  }

  subscription = new Subscription();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly authService: AuthService,
    private readonly dialogGenericService: DialogGenericService,
    private readonly formBuilderReset: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log(this.formBuilderReset);
    this.initForm();
  }

  initForm(): void {
    this.resetPasswordForm = this.formBuilderReset.group({
      [this.EMAIL_INPUT]: ['', [Validators.email, Validators.required]],
    });
  }

  resetPwd() {
    const req: PasswordResetRequest = {
      email: this.emailControl?.value,
    };
    this.subscription.add(
      this.authService
        .requestPasswordReset(req)
        .pipe(
          finalize(() => {
            this.requestSend = true;
          })
        )
        .subscribe()
    );
  }

  redirectSignInPopin(event: any): void {
    event?.preventDefault();
    this.dialogGenericService.close(CodeModaleEnum.RESET_PASSWORD);
    setTimeout(() => {
      this.dialogGenericService.openDialog(CodeModaleEnum.SIGNIN);
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
