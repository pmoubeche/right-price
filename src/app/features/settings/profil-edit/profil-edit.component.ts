import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { ContextService } from '../../../shared/services/context.service';

import { Gender } from '../../../shared/model/gender.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../../shared/components/dialogs/dialog-generic.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { UserModel, UserResponse, UserService } from '../../../../generated';
import { AuthServiceFront } from '../../../shared/services/auth-front.service';

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'nonBinary',
}

@Component({
    selector: 'app-profil-edit',
    imports: [MaterialModule, ReactiveFormsModule, FormsModule],
    templateUrl: './profil-edit.component.html',
    styleUrl: './profil-edit.component.scss'
})
export class ProfilEditComponent implements OnInit, OnDestroy {
  readonly USERNAME_FIELD = 'username';
  readonly EMAIL_FIELD = 'email';
  readonly NAME_FIELD = 'name';
  readonly IMAGE_FIELD = 'image';
  readonly FIRSTNAME_FIELD = 'firstname';
  readonly HEIGHT_FIELD = 'height';
  readonly WEIGHT_FIELD = 'weight';
  readonly GENDER_FIELD = 'gender';

  genders: Gender[] = [
    { id: GenderEnum.MALE, label: 'Homme' },
    { id: GenderEnum.FEMALE, label: 'Femme' },
    { id: GenderEnum.NON_BINARY, label: 'Non Binaire' },
  ];

  currentUser?: UserResponse | null;

  @Input() set user(user: UserModel) {
    if (user) {
      this._user = user;
      this.imageUrl = user.image;
      this.initForm();
    }
  }

  get user() {
    return this._user!;
  }

  private _user?: UserModel;
  editProfilForm?: FormGroup;
  imageUrl?: string;

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

  get imageControl(): FormControl {
    return this.editProfilForm?.get(this.IMAGE_FIELD) as FormControl;
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
    private readonly formBuilder: FormBuilder,
    private readonly authServiceFront: AuthServiceFront,
    private readonly dialogService: DialogGenericService,
    private readonly snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCurrentUserId();
  }

  private getCurrentUserId() {
    this.subscription.add(
      this.contextService
        .getCurrentUser()
        .pipe(
          tap((currentUser) => {
            this.currentUser = currentUser;
            this.initForm();
          })
        )
        .subscribe()
    );
  }

  private initForm() {
    this.editProfilForm = this.formBuilder.group({
      [this.USERNAME_FIELD]: [this.user ? this.user.username : ''],
      [this.EMAIL_FIELD]: [this.user ? this.user.email : ''],
      [this.NAME_FIELD]: [this.user ? this.user.name : ''],
      [this.FIRSTNAME_FIELD]: [this.user ? this.user.firstname : ''],
      [this.HEIGHT_FIELD]: [this.user ? this.user.height : ''],
      [this.WEIGHT_FIELD]: [this.user ? this.user.weight : ''],
      [this.GENDER_FIELD]: [this.user ? this.user.gender : null],
    });
  }

  public updateUser(): void {
    const userParam: UserModel = {
      id: this.currentUser?.id,
      username: this.usernameControl.value,
      firstname: this.firstnameControl.value,
      name: this.nameControl.value,
      email: this.emailControl.value,
      image: this.imageUrl,
      height: this.heightControl.value,
      weight: this.wieghtControl.value,
      gender: this.genderControl.value,
    };

    this.subscription.add(
      this.userService
        .updateUser(userParam)
        .pipe(
          tap((res) => {
            this.user = res.userModel!;
            this.authServiceFront.logIn(res.refreshTokenResponse!);
            this.snackBarService.show('Profil modifié avec succès');
          })
        )
        .subscribe()
    );
  }

  openPopInAvatar() {
    const dialogRef = this.dialogService.openDialog(CodeModaleEnum.AVATAR);

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(
          tap((res) => {
            this.user.image = res;
            this.imageUrl = res;
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
