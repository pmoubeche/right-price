import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { DialogContentModel } from './dialog-content.model';
import { DialogGenericService } from './dialog-generic.service';

@Component({
  selector: 'app-dialog-generic',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './dialog-generic.component.html',
  styleUrl: './dialog-generic.component.scss',
})
export class DialogGenericComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogContentModel,
    private readonly dialogGenericService: DialogGenericService
  ) {}
}
