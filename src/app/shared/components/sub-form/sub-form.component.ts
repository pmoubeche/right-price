import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MaterialModule } from '../../material/material.module';
import {
  ChipInputComponent,
  ChipItem,
} from '../chip-input/chip-input.component';
import {
  CodeLabel,
  SelectMultipleAllComponent,
} from '../select-multiple-all/select-multiple-all.component';

export class ItemModel {
  name?: string;
  chips?: ChipItem[];
  select?: CodeLabel[];
}

@Component({
  selector: 'app-sub-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    ChipInputComponent,
    MatButtonModule,
    SelectMultipleAllComponent,
  ],
  templateUrl: './sub-form.component.html',
  styleUrl: './sub-form.component.scss',
})
export class SubFormComponent {
  private readonly fb = inject(FormBuilder);

  item = input<ItemModel>(new ItemModel());
  index = input<number>(0);

  selectValues = signal<CodeLabel[]>([]);

  changes = output<FormGroup>();

  form = input<FormGroup>(
    this.fb.group({
      nameChild: [''],
      chips: [[]],
      select: [[]],
      index: [0],
    }),
  );

  codeLabels: CodeLabel[] = [
    { label: 'A', code: 'a' },
    { label: 'B', code: 'b' },
    { label: 'C', code: 'c' },
    { label: 'D', code: 'd' },
  ];

  get indexControl(): FormControl {
    return this.form()?.get('index') as FormControl;
  }

  get nameControl(): FormControl {
    return this.form()?.get('nameChild') as FormControl;
  }

  get selectControl(): FormControl {
    return this.form()?.get('select') as FormControl;
  }

  get chipsControl(): FormControl {
    return this.form()?.get('chips') as FormControl;
  }

  constructor() {
    effect(() => {
      this.nameControl.setValue(this.item().name || '');
      // Pour les chips, on set la valeur du formulaire directement à partir du signal item().chips
      this.chipsControl.setValue(this.item().chips || []);
      this.indexControl.setValue(this.index());

      //Set du signal pour Toutes les valeurs possibles pour le select
      this.selectValues.set(this.codeLabels);

      // Set de la valeur du select pour le formulaire
      this.selectControl.setValue(this.item().select || []);
      this.onChange();
    });
  }

  onChange(): void {
    this.changes.emit(this.form());
  }
}
