import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { ContextService } from '../../../shared/services/context.service';
import { CommonModule } from '@angular/common';
import { Gender, User } from '../../../shared/model/user.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { UserService } from '../../../shared/services/user.service';

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'nonBinary',
}

@Component({
  selector: 'app-profil-edit',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profil-edit.component.html',
  styleUrl: './profil-edit.component.scss',
})
export class ProfilEditComponent implements OnInit, OnDestroy {
  readonly USERNAME_FIELD = 'username';
  readonly EMAIL_FIELD = 'email';
  readonly NAME_FIELD = 'name';
  readonly FIRSTNAME_FIELD = 'firstname';
  readonly HEIGHT_FIELD = 'height';
  readonly WEIGHT_FIELD = 'weight';
  readonly GENDER_FIELD = 'gender';

  genders: Gender[] = [
    { id: GenderEnum.MALE, label: 'Homme' },
    { id: GenderEnum.FEMALE, label: 'Femme' },
    { id: GenderEnum.NON_BINARY, label: 'Non Binaire' },
  ];

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
  editProfilForm?: FormGroup;

  subscription = new Subscription();

  get usernameControl(): FormControl {
    return this.editProfilForm?.get(this.USERNAME_FIELD) as FormControl;
  }

  get nameControl(): FormControl {
    return this.editProfilForm?.get(this.NAME_FIELD) as FormControl;
  }

  get firstnameControl(): FormControl {
    return this.editProfilForm?.get(this.FIRSTNAME_FIELD) as FormControl;
  }

  get emailControl(): FormControl {
    return this.editProfilForm?.get(this.EMAIL_FIELD) as FormControl;
  }

  get heightControl(): FormControl {
    return this.editProfilForm?.get(this.HEIGHT_FIELD) as FormControl;
  }

  get wieghtControl(): FormControl {
    return this.editProfilForm?.get(this.WEIGHT_FIELD) as FormControl;
  }

  get genderControl(): FormControl {
    return this.editProfilForm?.get(this.GENDER_FIELD) as FormControl;
  }

  constructor(
    private readonly userService: UserService,
    private readonly contextService: ContextService,
    private readonly formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getCurrentUserId();
    // this.initForm();
  }

  private getCurrentUserId() {
    this.subscription.add(
      this.contextService
        .getCurrentUser()
        .pipe(
          tap((currentUser) => {
            this.currentUserId = currentUser?.id;
          })
        )
        .subscribe()
    );
  }

  private initForm() {
    this.editProfilForm = this.formBuilder.group({
      [this.USERNAME_FIELD]: [this.user.username ? this.user.username : ''],
      [this.EMAIL_FIELD]: [this.user.email ? this.user.email : ''],
      [this.NAME_FIELD]: [this.user.name ? this.user.name : ''],
      [this.FIRSTNAME_FIELD]: [this.user.firstname ? this.user.firstname : ''],
      [this.HEIGHT_FIELD]: [this.user.height ? this.user.height : ''],
      [this.WEIGHT_FIELD]: [this.user.weight ? this.user.weight : ''],
      [this.GENDER_FIELD]: [this.user.gender ? this.user.gender : ''],
    });
  }

  public updateUser(): void {
    const userParam: User = {
      id: this.currentUserId,
      username: this.usernameControl.value,
      firstname: this.firstnameControl.value,
      name: this.nameControl.value,
      email: this.emailControl.value,
      height: this.heightControl.value,
      weight: this.wieghtControl.value,
      gender: this.genderControl.value,
    };

    this.subscription.add(
      this.userService
        .updateUser(userParam)
        .pipe(
          tap((userUpdated) => {
            this.user = userUpdated;
          })
        )
        .subscribe()
    );
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
