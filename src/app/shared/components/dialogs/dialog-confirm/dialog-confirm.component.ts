import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../material/material.module';
import { DialogContentModel } from '../dialog-content.model';

@Component({
  selector: 'app-dialog-confirm',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './dialog-confirm.component.html',
})
export class DialogConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private dialogRef: MatDialogRef<DialogConfirmComponent>
  ) {}

  onConfirm() {
    this.data.confirm?.();
    this.dialogRef.close();
  }
}
