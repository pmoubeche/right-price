import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { DialogContentModel } from '../dialog-content.model';
import { DialogGenericService } from '../dialog-generic.service';

@Component({
  selector: 'app-dialog-info',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './dialog-info.component.html',
})
export class DialogInfoComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogGenericService: DialogGenericService
  ) {}
}
