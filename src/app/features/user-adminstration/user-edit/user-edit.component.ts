import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, tap } from 'rxjs';
import { UserAdminModel, UserService } from '../../../../generated';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../../shared/components/dialogs/dialog-generic.service';
import { RolesConstants } from '../../../shared/constants/role.constant';
import { MaterialModule } from '../../../shared/material/material.module';
import { Gender } from '../../../shared/model/gender.model';
import { RoleModel } from '../../../shared/model/role.model';
import { GenderEnum } from '../../settings/profil-edit/profil-edit.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-user-edit',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent {
  readonly USERNAME_FIELD = 'username';
  readonly EMAIL_FIELD = 'email';
  readonly NAME_FIELD = 'name';
  readonly IMAGE_FIELD = 'image';
  readonly FIRSTNAME_FIELD = 'firstname';
  readonly HEIGHT_FIELD = 'height';
  readonly WEIGHT_FIELD = 'weight';
  readonly GENDER_FIELD = 'gender';
  readonly ID_FIELD = 'id';
  readonly PASSWORD_FIELD = 'password';
  readonly ROLES_FIELD = 'roles';
  readonly DATE_CREATION_FIELD = 'dateCreation';
  readonly ORIGIN_FIELD = 'origin';
  readonly GOOGLE_ID_FIELD = 'googleId';
  readonly IS_EMAIL_VERIFIED_FIELD = 'emailVerified';
  readonly IS_ACTIVE_FIELD = 'isActive';

  genders: Gender[] = [
    { id: GenderEnum.MALE, label: 'Homme' },
    { id: GenderEnum.FEMALE, label: 'Femme' },
    { id: GenderEnum.NON_BINARY, label: 'Non Binaire' },
  ];

  roles: RoleModel[] = RolesConstants;

  userId?: string;

  public user?: UserAdminModel;
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

  get heightControl(): FormControl {
    return this.editProfilForm?.get(this.HEIGHT_FIELD) as FormControl;
  }

  get wieghtControl(): FormControl {
    return this.editProfilForm?.get(this.WEIGHT_FIELD) as FormControl;
  }

  get genderControl(): FormControl {
    return this.editProfilForm?.get(this.GENDER_FIELD) as FormControl;
  }

  get passwordControl(): FormControl {
    return this.editProfilForm?.get(this.PASSWORD_FIELD) as FormControl;
  }

  get rolesControl(): FormControl {
    return this.editProfilForm?.get(this.ROLES_FIELD) as FormControl;
  }

  get originControl(): FormControl {
    return this.editProfilForm?.get(this.ORIGIN_FIELD) as FormControl;
  }

  get dateCreationControl(): FormControl {
    return this.editProfilForm?.get(this.DATE_CREATION_FIELD) as FormControl;
  }

  get isActiveControl(): FormControl {
    return this.editProfilForm?.get(this.IS_ACTIVE_FIELD) as FormControl;
  }

  get idControl(): FormControl {
    return this.editProfilForm?.get(this.ID_FIELD) as FormControl;
  }

  hidePassword = true;

  selectedRoles: RoleModel[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly dialogService: DialogGenericService,
    private readonly snackBarService: ToastrService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.userId = this.activatedRoute.snapshot.params['id'];
    this.getUserFromRoute();
  }

  getUserFromRoute(): void {
    this.subscription.add(
      this.userService
        .getUserAdminById(this.userId!)
        .pipe(
          tap((user) => {
            this.user = user;
            this.imageUrl = user.image;
            this.selectedRoles = user.roles!;
            this.initForm();
          })
        )
        .subscribe()
    );
  }

  private initForm() {
    this.editProfilForm = this.formBuilder.group({
      [this.USERNAME_FIELD]: [
        this.user ? this.user.username : '',
        [Validators.required],
      ],
      [this.EMAIL_FIELD]: [
        this.user ? this.user.email : '',
        [Validators.required],
      ],
      [this.NAME_FIELD]: [this.user ? this.user.name : ''],
      [this.FIRSTNAME_FIELD]: [this.user ? this.user.firstname : ''],
      [this.HEIGHT_FIELD]: [this.user ? this.user.height : ''],
      [this.WEIGHT_FIELD]: [this.user ? this.user.weight : ''],
      [this.GENDER_FIELD]: [this.user ? this.user.gender : null],
      [this.PASSWORD_FIELD]: [''],
      [this.DATE_CREATION_FIELD]: [
        this.user ? this.user.dateCreation : '',
        [Validators.required],
      ],
      [this.ID_FIELD]: [
        this.user ? { value: this.user.id, disabled: true } : '',
      ],
      [this.IS_ACTIVE_FIELD]: [this.user ? this.user.isActive : ''],
      [this.ORIGIN_FIELD]: [this.user ? this.user.origin : ''],
      [this.ROLES_FIELD]: [this.selectedRoles, [Validators.required]],
    });
  }

  showPassword(event: MouseEvent) {
    this.hidePassword = !this.hidePassword;
    event.stopPropagation();
  }

  public updateUserAdmin(): void {
    const userParam: UserAdminModel = {
      id: this.userId,
      username: this.usernameControl.value,
      firstname: this.firstnameControl.value,
      name: this.nameControl.value,
      email: this.emailControl.value,
      image: this.imageUrl,
      height: this.heightControl.value,
      weight: this.wieghtControl.value,
      gender: this.genderControl.value,
      roles: this.rolesControl.value,
      dateCreation: this.dateCreationControl.value,
      origin: this.originControl.value,
      password: this.passwordControl.value,
      isActive: this.isActiveControl.value,
    };

    this.subscription.add(
      this.userService
        .updateUserByAdmin(userParam)
        .pipe(
          tap((userRes) => {
            this.user = userRes;
            this.initForm();
            this.snackBarService.success('Profil modifié avec succès');
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
            this.user!.image = res;
            this.imageUrl = res;
          })
        )
        .subscribe()
    );
  }

  isFormValid(): boolean {
    return (
      this.dateCreationControl.value &&
      this.rolesControl.value.length &&
      this.emailControl.value &&
      this.usernameControl.value
    );
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  comparerParName(objet1: any, objet2: any) {
    return objet1?.name === objet2?.name;
  }

  backToAdminstration(): void {
    this.router.navigate(['administration']);
  }

  reinitPreviousValue(): void {
    this.getUserFromRoute();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
