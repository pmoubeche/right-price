import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogInfoComponent } from './dialog-info/dialog-info.component';
import { DialogContentModel } from './dialog-content.model';
import { ComponentType } from '@angular/cdk/portal';
import { DialogSigninComponent } from './dialog-signin/dialog-signin.component';
import { DialogSignupComponent } from './dialog-signup/dialog-signup.component';
import { DialogDeleteAccountComponent } from './dialog-delete-account/dialog-delete-account.component';
import { DialogAvatarComponent } from './dialog-avatars/dialog-avatars.component';
import { DialogBannerEditComponent } from './dialog-banner-edit/dialog-banner-edit.component';
import { DialogCsvImportComponent } from './dialog-csv-import/dialog-csv-import.component';

export enum CodeModaleEnum {
  INFORMATION = 'information',
  SIGNIN = 'signin',
  SIGNUP = 'signup',
  DELETE_ACCOUNT = 'deleteAccount',
  AVATAR = 'avatar',
  BANNER = 'banner',
  CSV_IMPORT = 'csvImport',
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
      composant: DialogInfoComponent,
      width: '650px',
      isUniqueModale: true,
    },
    {
      code: CodeModaleEnum.SIGNIN,
      composant: DialogSigninComponent,
      width: '650px',
      isUniqueModale: true,
    },
    {
      code: CodeModaleEnum.SIGNUP,
      composant: DialogSignupComponent,
      width: '650px',
      isUniqueModale: true,
    },
    {
      code: CodeModaleEnum.DELETE_ACCOUNT,
      composant: DialogDeleteAccountComponent,
      width: '650px',
      isUniqueModale: true,
    },
    {
      code: CodeModaleEnum.CSV_IMPORT,
      composant: DialogCsvImportComponent,
      width: '650px',
      isUniqueModale: true,
    },
    {
      code: CodeModaleEnum.AVATAR,
      composant: DialogAvatarComponent,
      width: '1050px',
      isUniqueModale: true,
    },
    {
      code: CodeModaleEnum.BANNER,
      composant: DialogBannerEditComponent,
      width: '1050px',
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

  close(codeModale: CodeModaleEnum, valeur?: unknown): void {
    const dialogsForCode = this.matDialog.openDialogs.filter((dialog) =>
      dialog.id.includes(codeModale)
    );

    if (dialogsForCode.length > 0) {
      dialogsForCode.forEach((dialog) => dialog.close(valeur));
    }
  }
}
