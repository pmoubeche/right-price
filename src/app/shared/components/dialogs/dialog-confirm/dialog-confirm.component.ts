import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../../material/material.module';
import { DialogConfirmContentModel } from '../dialog-content.model';

@Component({
  standalone: true,
  selector: 'app-dialog-confirm',
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './dialog-confirm.component.html',
})
export class DialogConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogConfirmContentModel,
    private dialogRef: MatDialogRef<DialogConfirmComponent>
  ) {}

  getCardClasses(): string {
    let classApplied = `bg-light-${this.data.color} text-${this.data.color}`;
    this.data.isLoading$?.subscribe((val) => {
      if (val) {
        classApplied = 'bg-light text-dark';
      }
    });
    return classApplied;
  }

  onConfirm() {
    this.data.confirm?.();
    this.dialogRef.close();
  }
}
