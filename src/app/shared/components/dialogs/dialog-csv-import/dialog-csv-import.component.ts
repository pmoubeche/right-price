import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';
import { CgmImportService } from '../../../../../generated';
import { MaterialModule } from '../../../material/material.module';
import { ButtonAction, DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';
import { GlucoseMonitoringService } from '../../../../features/glucose-monitoring/glucose-monitoring.service';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-dialog-csv-import',
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './dialog-csv-import.component.html',
})
export class DialogCsvImportComponent implements OnInit {
  subscription = new Subscription();
  private buttonsDialog: ButtonAction[] = [
    {
      isCloseButton: true,
      label: 'Fermer',
    },
    {
      isIntialyFocused: true,
      label: 'Remplacer les données existantes',
      color: 'warn',
      icon: 'delete_forever',
    },
    {
      isIntialyFocused: true,
      label: 'Conserver les données existantes',
      color: 'accent',
      icon: 'delete_forever',
    },
  ];

  public dialogParamData: DialogContentModel = {
    title: 'Attention',
    message:
      'Des données sont déjà enregistrées pour la plage de dates que vous souhaitez importer. Que souhaitez vous faire avec  les données existantes ?',
    buttons: this.buttonsDialog,
  };

  public fileSelected!: File;
  public deviceSelected!: string;

  public isImportButtonLoading$ =
    this.glucoseMonitoringService.isImportButtonLoadingBs.asObservable();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogService: DialogGenericService,
    private readonly snackbarService: ToastrService,
    private readonly glucoseMonitoringService: GlucoseMonitoringService,
    private readonly cgmService: CgmImportService
  ) {}

  ngOnInit(): void {
    //@ts-ignore
    this.fileSelected = this.data[0];
    //@ts-ignore
    this.deviceSelected = this.data[1];
  }

  importCsvCgmImportOverrideExistingData(): void {
    this.glucoseMonitoringService.isImportButtonLoadingBs.next(true);
    this.subscription.add(
      this.cgmService
        .importCsvCgmImportOverrideExistingData(
          this.deviceSelected,
          this.fileSelected
        )
        .pipe(
          tap(() => {
            this.glucoseMonitoringService.isImportButtonLoadingBs.next(false);
            this.snackbarService.success("L'import modifié avec succés");
            this.dialogService.close(CodeModaleEnum.CSV_IMPORT);
          }),
          catchError(() => {
            this.glucoseMonitoringService.isImportButtonLoadingBs.next(false);
            this.snackbarService.error(
              "Une erreur est survenue lors de l'import"
            );
            return EMPTY;
          })
        )
        .subscribe()
    );
  }

  importCsvCgmImportPreserveExistingData(): void {
    this.glucoseMonitoringService.isImportButtonLoadingBs.next(true);
    this.subscription.add(
      this.cgmService
        .importCsvCgmImportPreserveExistingData(
          this.deviceSelected,
          this.fileSelected
        )
        .pipe(
          tap(() => {
            this.glucoseMonitoringService.isImportButtonLoadingBs.next(false);
            this.snackbarService.success("L'import modifié avec succés");
            this.dialogService.close(CodeModaleEnum.CSV_IMPORT);
          }),
          catchError(() => {
            this.glucoseMonitoringService.isImportButtonLoadingBs.next(false);
            this.snackbarService.error(
              "Une erreur est survenue lors de l'import"
            );
            return EMPTY;
          })
        )
        .subscribe()
    );
  }
}
