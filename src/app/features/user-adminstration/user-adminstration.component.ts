import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, tap } from 'rxjs';
import { PageRequest } from '../../shared/common/paginated/page';
import { PaginatedDataSource } from '../../shared/common/paginated/paginated-datasource';
import { SearchUserService } from '../../shared/common/paginated/paginated-services/search-user.service';
import { TableGenericComponent } from '../../shared/components/table-generic/table-generic.component';
import { TableGenericService } from '../../shared/components/table-generic/table-generic.service';
import {
  RoleAdmin,
  RoleGuest,
  RoleTier1,
  RoleTier2,
} from '../../shared/constants/role.constant';
import { MaterialModule } from '../../shared/material/material.module';
import { CodeLabelModel } from '../../shared/model/code-label.model';
import { UserFilterModel } from '../../shared/model/payload/request/user-filter.model';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../shared/model/table-column-param.model';
import { User } from '../../shared/model/user.model';
import { DateUtils } from '../../shared/utils/date.utils';

@Component({
  selector: 'app-user-adminstration',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableGenericComponent,
  ],
  templateUrl: './user-adminstration.component.html',
  styleUrl: './user-adminstration.component.scss',
})
export class UserAdminstrationComponent implements OnInit {
  readonly USERNAME_FIELD = 'username';
  readonly NAME_FIELD = 'name';
  readonly FIRSTNAME_FIELD = 'firstname';
  readonly EMAIL_FIELD = 'email';
  readonly ROLES_FIELD = 'roles';
  readonly DATE_CREATION_START_FIELD = 'dateCreationStart';
  readonly DATE_CREATION_END_FIELD = 'dateCreationEnd';
  readonly ORIGIN_FIELD = 'origin';
  readonly STATUS_USER_FIELD = 'statusUser';

  readonly STATUS_ACTIVE = 'active';
  readonly STATUS_INACTIVE = 'inactive';

  statusCodeLabels: CodeLabelModel[] = [
    {
      code: 'active',
      label: 'Actif',
    },
    {
      code: 'inactive',
      label: 'Inactif',
    },
  ];

  originCodeLabels: CodeLabelModel[] = [
    { code: 'google', label: 'Google' },
    { code: 'email', label: 'Email' },
  ];

  rolesOptions: CodeLabelModel[] = [
    RoleGuest,
    RoleTier1,
    RoleTier2,
    RoleAdmin,
  ].map((role) => {
    return {
      code: role.id,
      label: role.name?.substring(0, role.name.indexOf('_')),
    };
  });

  paramsColums: TableColumnParamModel[] = [
    {
      id: '1',
      columDef: 'image',
      label: 'Image',
      type: ColumnTypeParamEnum.AVATAR,
    },
    {
      id: '2',
      columDef: 'username',
      label: "Nom d'utilisateur",
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '3',
      columDef: 'name',
      label: 'Nom ',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '4',
      columDef: 'firstname',
      label: 'Prenom',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '5',
      columDef: 'email',
      label: 'Adresse email',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '6',
      columDef: 'rolesStringList',
      label: 'Roles',
      type: ColumnTypeParamEnum.CHIPS,
    },
    {
      id: '7',
      columDef: 'dateCreation',
      label: 'Date de création',
      type: ColumnTypeParamEnum.DATE,
    },
    {
      id: '8',
      columDef: 'origin',
      label: 'Origine',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '9',
      columDef: 'isActive',
      label: 'Actif',
      type: ColumnTypeParamEnum.BOOLEAN,
    },
  ];

  usersPaginated = new PaginatedDataSource<User>();

  filterForm?: FormGroup;

  users: User[] = [];

  get usernameControl(): FormControl {
    return this.filterForm?.get(this.USERNAME_FIELD) as FormControl;
  }

  get nameControl(): FormControl {
    return this.filterForm?.get(this.NAME_FIELD) as FormControl;
  }

  get firstnameControl(): FormControl {
    return this.filterForm?.get(this.FIRSTNAME_FIELD) as FormControl;
  }

  get emailControl(): FormControl {
    return this.filterForm?.get(this.EMAIL_FIELD) as FormControl;
  }

  get rolesControl(): FormControl {
    return this.filterForm?.get(this.ROLES_FIELD) as FormControl;
  }

  get dateCreationStartControl(): FormControl {
    return this.filterForm?.get(this.DATE_CREATION_START_FIELD) as FormControl;
  }

  get dateCreationEndControl(): FormControl {
    return this.filterForm?.get(this.DATE_CREATION_END_FIELD) as FormControl;
  }

  get originControl(): FormControl {
    return this.filterForm?.get(this.ORIGIN_FIELD) as FormControl;
  }

  get statusControl(): FormControl {
    return this.filterForm?.get(this.STATUS_USER_FIELD) as FormControl;
  }

  subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly tableGenericService: TableGenericService,
    private readonly userSearchService: SearchUserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getUsers(this.setUserFilterModelEmpty());
  }

  initForm() {
    this.filterForm = this.formBuilder.group({
      [this.USERNAME_FIELD]: [''],
      [this.NAME_FIELD]: [''],
      [this.FIRSTNAME_FIELD]: [''],
      [this.EMAIL_FIELD]: [''],
      [this.ROLES_FIELD]: [''],
      [this.DATE_CREATION_START_FIELD]: [''],
      [this.DATE_CREATION_END_FIELD]: [''],
      [this.ORIGIN_FIELD]: [''],
      [this.STATUS_USER_FIELD]: [true],
    });
  }

  setUserFilterModelEmpty(): UserFilterModel {
    return {
      username: '',
      name: '',
      firstname: '',
      email: '',
      roles: [],
      dateCreationStart: '',
      dateCreationEnd: '',
      origin: '',
      isActive: true,
    };
  }

  setUserFilterModelFromForm(): UserFilterModel {
    return {
      username: this.usernameControl.value,
      name: this.nameControl.value,
      firstname: this.firstnameControl.value,
      email: this.emailControl.value,
      roles:
        this.rolesControl.value === ''
          ? []
          : this.rolesControl.value.map((roleOption: any) => roleOption.code),
      dateCreationStart:
        this.dateCreationStartControl.value === ''
          ? ''
          : DateUtils.formatDate(this.dateCreationStartControl.value),
      dateCreationEnd:
        this.dateCreationEndControl.value === ''
          ? ''
          : DateUtils.formatDate(this.dateCreationEndControl.value),
      origin: this.originControl.value,
      isActive: this.statusControl.value,
    };
  }

  getUsers(userFilter: UserFilterModel, pageIndex = 0, pageSize = 10) {
    const pageUserRequest: PageRequest<User> = {
      page: pageIndex,
      size: pageSize,
      sort: { property: 'username', order: 'asc' },
    };
    this.subscription.add(
      this.userSearchService
        .page(pageUserRequest, userFilter)
        .pipe(
          tap((getUsersResponse) => {
            this.users = getUsersResponse.content;
            this.usersPaginated.pageIndex = pageUserRequest.page;
            this.usersPaginated.pageSize = getUsersResponse.number;
            this.usersPaginated.pageCount = getUsersResponse.size;
            this.usersPaginated.length = getUsersResponse.totalElements;
            this.usersPaginated!.dataSource = new MatTableDataSource<User>(
              getUsersResponse.content
            );
            this.tableGenericService.loadingBs.next(false);
          })
        )
        .subscribe()
    );
  }

  changePageSize(event: number) {
    this.getUsers(this.setUserFilterModelFromForm(), 0, event);
  }

  changePageIndex(event: number) {
    this.getUsers(this.setUserFilterModelFromForm(), event, 10);
  }

  search(): void {
    this.getUsers(this.setUserFilterModelFromForm());
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
}
