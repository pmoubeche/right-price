import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../material/material.module';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';

@Component({
  selector: 'app-dialog-subscribe-tier1',
  standalone: true,
  imports: [MaterialModule, SafeUrlPipe],
  templateUrl: './dialog-subscribe-tier1.component.html',
})
export class ExternalLinkDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string }) {}
}
