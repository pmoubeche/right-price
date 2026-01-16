import {
  Component,
  Input,
  isStandalone,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-select-check-all',
  templateUrl: './select-check-all.component.html',
  styleUrls: ['./select-check-all.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MaterialModule],
})
export class SelectCheckAllComponent {
  @Input() model!: FormControl;
  @Input() values: any[] = [];
  @Input() text = 'Selectionner tout';

  isChecked(): boolean {
    return (
      this.model.value &&
      this.values.length &&
      this.model.value.length === this.values.length
    );
  }

  isIndeterminate(): boolean {
    return (
      this.model.value &&
      this.values.length &&
      this.model.value.length &&
      this.model.value.length < this.values.length
    );
  }

  toggleSelection(change: MatCheckboxChange): void {
    if (change.checked) {
      this.model.setValue(this.values);
    } else {
      this.model.setValue([]);
    }
  }
}
