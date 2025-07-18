import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';
import { CgmImportService, DateRangeFilter } from '../../../../../generated';
import { MaterialModule } from '../../../material/material.module';
import { DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DateUtils } from '../../../utils/date.utils';
import { TablerIconsModule } from 'angular-tabler-icons';
import { GlucoseMonitoringService } from '../../../../features/glucose-monitoring/glucose-monitoring.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dialog-delete-account',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    TablerIconsModule,
    CommonModule,
  ],
  templateUrl: './dialog-delete-cgm.component.html',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class DialogDeleteDataCgmComponent implements OnInit {
  subscription = new Subscription();

  public dialogParamData: DialogContentModel = {
    title: 'Attention',
    message:
      'Veuillez selectionner une plage de dates pour lesquelles vous souhaitez supprimer les données. Si vous ne sélectionnez pas une plage de date, toutes vos données seront supprimées.',
  };

  selectedDateRange: DateRange<Date> | undefined;

  public isDeleteButtonLoading$ =
    this.glucMonService.isDeleteCgmButtonLoadingBs.asObservable();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly cgmImportServiceApi: CgmImportService,
    private readonly snackbarService: ToastrService,
    private readonly dialogService: DialogGenericService,
    private readonly glucMonService: GlucoseMonitoringService
  ) {}

  ngOnInit(): void {}

  deleteDataCgm(): void {
    let filter: DateRangeFilter = {};
    if (this.selectedDateRange) {
      filter = {
        dateStart: DateUtils.formatDateMinus1(
          this.selectedDateRange?.start!
        ).toISOString(),
        dateEnd: DateUtils.formatDateMinus1(
          this.selectedDateRange?.end!
        ).toISOString(),
      };
    }

    this.glucMonService.isDeleteCgmButtonLoadingBs.next(true);

    this.subscription.add(
      this.cgmImportServiceApi
        .deleteByDateRange(filter)
        .pipe(
          tap(() => {
            this.glucMonService.isDeleteCgmButtonLoadingBs.next(false);
            this.dialogService.close(CodeModaleEnum.DELETE_DATA_CGM);
            this.snackbarService.success('Données supprimées avec succès');
          }),
          catchError(() => {
            this.glucMonService.isDeleteCgmButtonLoadingBs.next(false);
            this.snackbarService.error(
              'Une erreur est survenue lors de la suppression des données'
            );
            return EMPTY;
          })
        )
        .subscribe()
    );
  }

  _onSelectedChange(date: Date): void {
    if (
      this.selectedDateRange &&
      this.selectedDateRange.start &&
      date > this.selectedDateRange.start &&
      !this.selectedDateRange.end
    ) {
      this.selectedDateRange = new DateRange(
        this.selectedDateRange.start,
        date
      );
    } else {
      this.selectedDateRange = new DateRange(date, null);
    }
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    const dateStr = date.toLocaleDateString();
    const isCgm = this.data.has(dateStr);
    if (isCgm) return 'highlight-date-warning';
    return '';
  };
}
