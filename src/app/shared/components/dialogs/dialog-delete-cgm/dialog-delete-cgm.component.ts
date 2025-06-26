import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';
import { CgmImportService, DateRangeFilter } from '../../../../../generated';
import { MaterialModule } from '../../../material/material.module';
import { ButtonAction, DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';
import { provideNativeDateAdapter } from '@angular/material/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateUtils } from '../../../utils/date.utils';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
    selector: 'app-dialog-delete-account',
    imports: [MaterialModule, ReactiveFormsModule, FormsModule],
    templateUrl: './dialog-delete-cgm.component.html',
    styleUrl: './dialog-delete-cgm.component.scss',
    providers: [
        provideNativeDateAdapter(),
        {
            provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
            useClass: DefaultMatCalendarRangeStrategy,
        },
    ],
    encapsulation: ViewEncapsulation.None
})
export class DialogDeleteDataCgmComponent implements OnInit {
  subscription = new Subscription();

  public dialogParamData: DialogContentModel = {
    title: 'Attention',
    message:
      'Veuillez selectionner une plage de dates pour lesquelles vous souhaitez supprimer les données. Si vous ne sélectionnez pas une plage de date, toutes vos données seront supprimées.',
  };

  selectedDateRange: DateRange<Date> | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly cgmImportServiceApi: CgmImportService,
    private readonly snackbarService: SnackbarService,
    private readonly dialogService: DialogGenericService
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

    this.subscription.add(
      this.cgmImportServiceApi
        .deleteByDateRange(filter)
        .pipe(
          tap(() => {
            this.dialogService.close(CodeModaleEnum.DELETE_DATA_CGM);
            this.snackbarService.show('Données supprimées avec succès');
          }),
          catchError(() => {
            this.snackbarService.show(
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
    let classApplied = '';
    const meDates = this.data.source.value.datesCgm.map(
      (date: any) => new Date(date)
    );
    const index = meDates.findIndex(
      (x: any) => new Date(x).toLocaleDateString() === date.toLocaleDateString()
    );
    if (index > -1) {
      classApplied = 'highlight-date';
    }
    return classApplied;
  };
}
