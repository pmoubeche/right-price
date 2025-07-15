import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  NativeDateAdapter,
} from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription, tap } from 'rxjs';
import {
  BannerCreateModel,
  BannerInfoModel,
  BannerService,
} from '../../../../../generated';
import { MaterialModule } from '../../../material/material.module';
import { CodeLabelModel } from '../../../model/code-label.model';
import { DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';

@Component({
  selector: 'app-dialog-banner-edit',
  imports: [MaterialModule, ReactiveFormsModule, FormsModule],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  templateUrl: './dialog-banner-edit.component.html',
  styleUrl: './dialog-banner-edit.component.scss',
})
export class DialogBannerEditComponent implements OnInit, OnDestroy {
  readonly MESSAGE_INPUT = 'message';
  readonly TYPE_INPUT = 'type';
  readonly DATE_CREATION_FIELD = 'dateCreation';
  readonly IS_ACTIVE_FIELD = 'isActive';

  typeCodeLabels: CodeLabelModel[] = [
    { code: 'info', label: 'Information' },
    { code: 'warn', label: 'Warning' },
  ];

  bannerCreateForm?: FormGroup;

  bannerId?: string;
  messageBanner = '';
  dateCreationBanner = '';
  isActiveBanner = false;
  selectedType = '';

  get messageControl(): FormControl {
    return this.bannerCreateForm?.get(this.MESSAGE_INPUT) as FormControl;
  }

  get typeControl(): FormControl {
    return this.bannerCreateForm?.get(this.TYPE_INPUT) as FormControl;
  }

  get dateCreationControl(): FormControl {
    return this.bannerCreateForm?.get(this.DATE_CREATION_FIELD) as FormControl;
  }

  get isActiveControl(): FormControl {
    return this.bannerCreateForm?.get(this.IS_ACTIVE_FIELD) as FormControl;
  }

  subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogGenericService: DialogGenericService,
    private readonly snackbarService: ToastrService,
    private readonly bannerService: BannerService,
    private readonly formBuilder: FormBuilder
  ) {
    if (data.data) {
      this.bannerId = data.data.id;
      this.messageBanner = data.data.message;
      this.dateCreationBanner = data.data.dateCreation;
      this.isActiveBanner = data.data.isActive;
      this.selectedType = data.data.type;
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.bannerCreateForm = this.formBuilder.group({
      [this.MESSAGE_INPUT]: [this.messageBanner, [Validators.required]],
      [this.DATE_CREATION_FIELD]: [
        this.dateCreationBanner,
        [Validators.required],
      ],
      [this.IS_ACTIVE_FIELD]: [this.isActiveBanner],
      [this.TYPE_INPUT]: [this.selectedType],
    });
  }

  createOrUpdate(): void {
    if (!this.bannerId) {
      const bannerCreate: BannerCreateModel = {
        message: this.messageControl.value,
        dateCreation: this.dateCreationControl.value,
        isActive: this.isActiveControl.value,
        type: this.typeControl.value,
      };
      if (this.bannerCreateForm?.valid) {
        this.subscription.add(
          this.bannerService
            .createBanner(bannerCreate)
            .pipe(
              tap(() => {
                this.snackbarService.success('Bannière créée avec succès');
                this.dialogGenericService.close(CodeModaleEnum.BANNER);
              })
            )
            .subscribe()
        );
      }
    } else {
      const bannerParam: BannerInfoModel = {
        id: this.bannerId!,
        message: this.messageControl.value,
        dateCreation: this.dateCreationControl.value,
        isActive: this.isActiveControl.value,
        type: this.typeControl.value,
      };
      if (this.bannerCreateForm?.valid) {
        this.subscription.add(
          this.bannerService
            .updateBanner(bannerParam)
            .pipe(
              tap(() => {
                this.snackbarService.success('Bannière modifiée avec succès');
                this.dialogGenericService.close(CodeModaleEnum.BANNER);
              })
            )
            .subscribe()
        );
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
