import { Component, effect, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  ItemModel,
  SubFormComponent,
} from '../../shared/components/sub-form/sub-form.component';
import { MaterialModule } from '../../shared/material/material.module';
import { EventsComponent } from '../events/events.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MaterialModule,
    EventsComponent,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    SubFormComponent,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly fb = inject(FormBuilder);

  subItems: ItemModel[] = [
    {
      name: 'Item 1',
      chips: [
        { label: 'Tag 1', value: 'tag1', selected: false, disabled: false },
        { label: 'Tag 2', value: 'tag2', selected: true, disabled: false },
        { label: 'Tag 3', value: 'tag3', selected: false, disabled: true },
      ],
      select: [{ label: 'A', code: 'a' }],
    },
    {
      name: 'Item 2',
      chips: [
        { label: 'Tag 1', value: 'tag1', selected: false, disabled: false },
        { label: 'Tag 2', value: 'tag2', selected: true, disabled: false },
      ],
      select: [
        { label: 'A', code: 'a' },
        { label: 'B', code: 'b' },
      ],
    },
  ];

  formParent!: FormGroup;
  formGlobal!: FormGroup;

  get childs(): FormArray {
    return this.formGlobal.get('childs') as FormArray;
  }

  constructor() {
    this.formParent = this.fb.group({
      textParent: [''],
    });
    this.formGlobal = this.fb.group({
      parent: this.formParent,
      childs: this.fb.array([]),
    });

    effect(() => {
      this.formParent.get('textParent')?.setValue('toto');
    });
  }

  submit(): void {
    console.log(this.formGlobal.value);
  }

  onSubFormChange(event: FormGroup): void {
    const indexToReplace = this.childs.controls.findIndex(
      (control) => control.get('index')?.value === event.get('index')?.value,
    );

    if (indexToReplace !== -1) {
      this.childs.setControl(indexToReplace, event);
    } else {
      this.childs.push(event);
    }
  }
}
