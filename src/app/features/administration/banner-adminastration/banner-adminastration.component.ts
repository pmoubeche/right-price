import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription, tap } from 'rxjs';
import {
  BannerFilterModel,
  BannerInfoModel,
  BannerService,
} from '../../../../generated';
import { PageRequest } from '../../../shared/common/paginated/page';
import { PaginatedDataSource } from '../../../shared/common/paginated/paginated-datasource';
import { SearchBannerService } from '../../../shared/common/paginated/paginated-services/search-banner.service';
import {
  ButtonAction,
  DialogContentModel,
} from '../../../shared/components/dialogs/dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../../shared/components/dialogs/dialog-generic.service';
import { TableGenericComponent } from '../../../shared/components/table-generic/table-generic.component';
import { TableGenericService } from '../../../shared/components/table-generic/table-generic.service';
import { MaterialModule } from '../../../shared/material/material.module';
import { ButtonParam } from '../../../shared/model/button-param';
import { CodeLabelModel } from '../../../shared/model/code-label.model';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../../shared/model/table-column-param.model';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-banner-adminastration',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    TableGenericComponent,
    TablerIconsModule,
  ],
  templateUrl: './banner-adminastration.component.html',
})
export class BannerAdminastrationComponent implements OnInit, OnDestroy {
  readonly MESSAGE_FIELD = 'message';
  readonly DATE_CREATION_START_FIELD = 'dateCreationStart';
  readonly DATE_CREATION_END_FIELD = 'dateCreationEnd';
  readonly STATUS_BANNER_FIELD = 'statusBanner';
  readonly TYPE_FIELD = 'type';

  readonly STATUS_ACTIVE = 'active';
  readonly STATUS_INACTIVE = 'inactive';

  statusCodeLabels: { value?: boolean | null; label: string }[] = [
    { value: undefined, label: 'Tous' },
    {
      value: true,
      label: 'Actif',
    },
    {
      value: false,
      label: 'Inactif',
    },
  ];

  typesCodeLabels: CodeLabelModel[] = [
    { code: '', label: 'Tous' },
    {
      code: 'info',
      label: 'Information',
    },
    {
      code: 'warn',
      label: 'Warning',
    },
  ];

  paramsColums: TableColumnParamModel[] = [
    {
      id: '1',
      columDef: 'message',
      label: 'Message',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '2',
      columDef: 'type',
      label: 'Type',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '3',
      columDef: 'dateCreation',
      label: 'Date',
      type: ColumnTypeParamEnum.DATE,
    },
    {
      id: '4',
      columDef: 'isActive',
      label: 'Actif',
      type: ColumnTypeParamEnum.BOOLEAN,
    },
    {
      id: '5',
      label: 'Actions',
      columDef: ColumnTypeParamEnum.ACTIONS,
      type: ColumnTypeParamEnum.ACTIONS,
    },
  ];

  buttonsParams: ButtonParam[] = [
    {
      label: 'Modifier',
      icon: 'edit',
      color: 'success',
      action: (row: any) => this.updateBanner(row),
    },
    {
      label: 'Supprimer',
      icon: 'trash-x',
      color: 'error',
      action: (row: any) => this.deleteBanner(row),
    },
  ];

  bannersPaginated = new PaginatedDataSource<BannerInfoModel>();

  filterForm?: FormGroup;

  banners: BannerInfoModel[] = [];

  get messageControl(): FormControl {
    return this.filterForm?.get(this.MESSAGE_FIELD) as FormControl;
  }

  get typeControl(): FormControl {
    return this.filterForm?.get(this.TYPE_FIELD) as FormControl;
  }

  get dateCreationStartControl(): FormControl {
    return this.filterForm?.get(this.DATE_CREATION_START_FIELD) as FormControl;
  }

  get dateCreationEndControl(): FormControl {
    return this.filterForm?.get(this.DATE_CREATION_END_FIELD) as FormControl;
  }

  get statusControl(): FormControl {
    return this.filterForm?.get(this.STATUS_BANNER_FIELD) as FormControl;
  }

  private buttonsDialog: ButtonAction[] = [
    {
      isCloseButton: true,
      label: 'Fermer',
    },
  ];

  private dialogCreateBannerParamData: DialogContentModel = {
    title: 'Créer une bannière',
    buttons: this.buttonsDialog,
  };

  private dialogModifyBannerParamData: DialogContentModel = {
    title: 'Modifier une bannière',
    buttons: this.buttonsDialog,
  };

  subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly tableGenericService: TableGenericService,
    private readonly bannerSearchService: SearchBannerService,
    private readonly bannerService: BannerService,
    private readonly dialogService: DialogGenericService,
    private readonly snackbarService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getBanners(this.setBannerFilterModelEmpty());
  }

  initForm() {
    this.filterForm = this.formBuilder.group({
      [this.MESSAGE_FIELD]: [''],
      [this.TYPE_FIELD]: [''],
      [this.DATE_CREATION_START_FIELD]: [''],
      [this.DATE_CREATION_END_FIELD]: [''],
      [this.STATUS_BANNER_FIELD]: [undefined],
    });
  }

  setBannerFilterModelEmpty(): BannerFilterModel {
    return {
      message: '',
      dateCreationStart: '',
      dateCreationEnd: '',
      type: '',
      isActive: undefined,
    };
  }

  setBannerFilterModelFromForm(): BannerFilterModel {
    return {
      message: this.messageControl.value,
      type: this.typeControl.value,
      dateCreationStart:
        this.dateCreationStartControl.value === ''
          ? ''
          : new Date(this.dateCreationStartControl.value).toISOString(),
      dateCreationEnd:
        this.dateCreationEndControl.value === ''
          ? ''
          : new Date(this.dateCreationEndControl.value).toISOString(),
      isActive: this.statusControl.value,
    };
  }

  getBanners(bannerFilter: BannerFilterModel, pageIndex = 0, pageSize = 10) {
    const pageBannerRequest: PageRequest<BannerInfoModel> = {
      page: pageIndex,
      size: pageSize,
      sort: { property: 'dateCreation', order: 'desc' },
    };
    this.subscription.add(
      this.bannerSearchService
        .page(pageBannerRequest, bannerFilter)
        .pipe(
          tap((getBannersResponse) => {
            this.banners = getBannersResponse.content;
            this.bannersPaginated.pageIndex = pageBannerRequest.page;
            this.bannersPaginated.pageSize = getBannersResponse.number;
            this.bannersPaginated.pageCount = getBannersResponse.size;
            this.bannersPaginated.length = getBannersResponse.totalElements;
            this.bannersPaginated!.dataSource =
              new MatTableDataSource<BannerInfoModel>(
                getBannersResponse.content
              );
            this.tableGenericService.loadingBs.next(false);
          })
        )
        .subscribe()
    );
  }

  createBanner(): void {
    const dialogRef = this.dialogService.openDialog(
      CodeModaleEnum.BANNER,
      this.dialogCreateBannerParamData
    );

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(tap(() => this.getBanners(this.setBannerFilterModelEmpty())))
        .subscribe()
    );
  }

  changePageSize(event: number) {
    this.getBanners(this.setBannerFilterModelFromForm(), 0, event);
  }

  changePageIndex(event: number) {
    this.getBanners(this.setBannerFilterModelFromForm(), event, 10);
  }

  search(): void {
    this.getBanners(this.setBannerFilterModelFromForm());
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  reinitFilters(): void {
    this.initForm();
  }

  deleteBanner(event: any) {
    this.subscription.add(
      this.bannerService
        .deleteBanner(event.id)
        .pipe(
          tap(() => {
            this.snackbarService.success('Bannière supprimée');
            this.getBanners(this.setBannerFilterModelEmpty());
          })
        )
        .subscribe()
    );
  }

  updateBanner(event: any) {
    this.dialogModifyBannerParamData.data = event;
    const dialogRef = this.dialogService.openDialog(
      CodeModaleEnum.BANNER,
      this.dialogModifyBannerParamData
    );

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(tap(() => this.getBanners(this.setBannerFilterModelEmpty())))
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
