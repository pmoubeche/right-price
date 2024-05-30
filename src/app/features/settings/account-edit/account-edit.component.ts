import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../shared/model/user.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../../shared/material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account-edit',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.scss',
})
export class AccountEditComponent implements OnInit {
  readonly PREVIOUS_PASSWORD_FIELD = 'previousPassword';
  readonly NEW_PASSWORD_FIELD = 'newPassword';
  readonly CONFIRM_PASSWORD_FIELD = 'confirmPassword';
  readonly DATE_CREATION = 'dateCreation';

  currentUserId?: string;

  @Input() set user(user: User) {
    if (user) {
      this._user = user;
      this.initForm();
    }
  }

  get user() {
    return this._user!;
  }

  private _user = new User();
  passwordChangeForm!: FormGroup;

  subscription = new Subscription();

  get previousPasswordControl(): FormControl {
    return this.passwordChangeForm?.get(
      this.PREVIOUS_PASSWORD_FIELD
    ) as FormControl;
  }

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

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // this.initForm();
  }

  private initForm() {
    this.passwordChangeForm = this.formBuilder.group({
      [this.PREVIOUS_PASSWORD_FIELD]: [''],
      [this.NEW_PASSWORD_FIELD]: [''],
      [this.CONFIRM_PASSWORD_FIELD]: [''],
      [this.DATE_CREATION]: [new Date()],
    });
  }

  showPassword(event: MouseEvent) {
    this.hidePassword = !this.hidePassword;
    event.stopPropagation();
  }
}
