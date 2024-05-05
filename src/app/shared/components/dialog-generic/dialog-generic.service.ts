import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogGenericComponent } from './dialog-generic.component';
import { DialogContentModel } from './dialog-content.model';
import { ComponentType } from '@angular/cdk/portal';

export enum CodeModaleEnum {
  INFORMATION = 'information',
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
      code: CodeModaleEnum.INFORMATION,
      composant: DialogGenericComponent,
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
}
