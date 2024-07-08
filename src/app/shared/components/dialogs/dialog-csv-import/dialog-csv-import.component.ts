import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';
import { CgmImportService } from '../../../../../generated';
import { MaterialModule } from '../../../material/material.module';
import { SnackbarService } from '../../../services/snackbar.service';
import { ButtonAction, DialogContentModel } from '../dialog-content.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialog-generic.service';

@Component({
  selector: 'app-dialog-csv-import',
  standalone: true,
  imports: [MaterialModule],
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
      'Des données sont déjà enregistrées pour la plage de dates que vous souhaitez importer. Que souhaitez vous faire ?',
    buttons: this.buttonsDialog,
  };

  public fileSelected!: File;
  public deviceSelected!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogService: DialogGenericService,
    private readonly snackbarService: SnackbarService,
    private readonly cgmService: CgmImportService
  ) {}

  ngOnInit(): void {
    //@ts-ignore
    this.fileSelected = this.data[0];
    //@ts-ignore
    this.deviceSelected = this.data[1];
  }

  importCsvCgmImportOverrideExistingData(): void {
    this.subscription.add(
      this.cgmService
        .importCsvCgmImportOverrideExistingData(
          this.deviceSelected,
          this.fileSelected
        )
        .pipe(
          tap(() => {
            this.snackbarService.show("L'import modifié avec succés");
            this.dialogService.close(CodeModaleEnum.CSV_IMPORT);
          }),
          catchError(() => {
            this.snackbarService.show(
              "Une erreur est survenue lors de l'import"
            );
            return EMPTY;
          })
        )
        .subscribe()
    );
  }

  importCsvCgmImportPreserveExistingData(): void {
    this.subscription.add(
      this.cgmService
        .importCsvCgmImportPreserveExistingData(
          this.deviceSelected,
          this.fileSelected
        )
        .pipe(
          tap(() => {
            this.snackbarService.show("L'import modifié avec succés");
            this.dialogService.close(CodeModaleEnum.CSV_IMPORT);
          }),
          catchError(() => {
            this.snackbarService.show(
              "Une erreur est survenue lors de l'import"
            );
            return EMPTY;
          })
        )
        .subscribe()
    );
  }
}
