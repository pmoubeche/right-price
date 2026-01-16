import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogContentModel } from '../models/dialog-content.model';
import { DialogCreateEventComponent } from '../dialogs/dialog-create-event/dialog-create-event.component';

export enum CodeModaleEnum {
  CREATE_EVENT = 'createEvent',
}

export interface ConfigModaleModel {
  code: CodeModaleEnum;
  composant: ComponentType<any>;
  width: string;
  isUniqueModale: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DialogGenericService {
  private readonly CONFIGS_MODALES: ConfigModaleModel[] = [
    {
      code: CodeModaleEnum.CREATE_EVENT,
      composant: DialogCreateEventComponent,
      width: '650px',
      isUniqueModale: true,
    },
  ];

  constructor(public matDialog: MatDialog) {}

  openDialog(
    code: CodeModaleEnum,
    donnees?: any
  ): MatDialogRef<DialogContentModel['component'], any> {
    const configModale: ConfigModaleModel = this.CONFIGS_MODALES.find(
      (config) => config.code === code
    )!;

    if (configModale.isUniqueModale) {
      const modaleExistante = this.matDialog.openDialogs.find((modale) =>
        modale.id.includes(code)
      );
      if (modaleExistante) {
        return modaleExistante;
      }
    }

    const configMatDialog: MatDialogConfig = {
      id: `${code}_${new Date().getTime()}`,
      width: configModale.width,
      data: donnees,
    };

    return this.matDialog.open(configModale.composant, configMatDialog);
  }

  // openConfirmDialog(
  //   config: DialogContentModel
  // ): MatDialogRef<DialogContentModel['component'], any> {
  //   return this.openDialog(CodeModaleEnum.CONFRIM, config);
  // }

  close(codeModale: CodeModaleEnum, valeur?: unknown): void {
    const dialogsForCode = this.matDialog.openDialogs.filter((dialog) =>
      dialog.id.includes(codeModale)
    );

    if (dialogsForCode.length > 0) {
      dialogsForCode.forEach((dialog) => dialog.close(valeur));
    }
  }
}
