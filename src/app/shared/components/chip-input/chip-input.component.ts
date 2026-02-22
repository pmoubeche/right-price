import { CommonModule } from '@angular/common';
import { Component, effect, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MaterialModule } from '../../material/material.module';

export interface ChipItem {
  label: string;
  value: any;
  selected: boolean;
  disabled: boolean;
}

@Component({
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    CommonModule,
  ],
  selector: 'app-chip-input',
  templateUrl: './chip-input.component.html',
  styleUrls: ['./chip-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipInputComponent),
      multi: true,
    },
  ],
})
export class ChipInputComponent implements ControlValueAccessor {
  placeholder = input<string>('Ajouter...');
  removable = input<boolean>(true);
  defaultValues = input<ChipItem[]>([]);

  chips: ChipItem[] = [];
  inputValue = '';
  disabled = false;

  constructor() {
    effect(() => {
      this.chips = this.defaultValues().map((v) => ({
        label: v.label,
        value: v.value,
        selected: v.selected,
        disabled: v.disabled,
      }));
    });
  }

  private onChange: (value: any[]) => void = () => {};
  private onTouched: () => void = () => {};

  /* =========================
     ControlValueAccessor
  ========================= */

  writeValue(values: any[]): void {
    if (Array.isArray(values)) {
      this.chips = values.map((v) => ({
        label: v,
        value: v,
        selected: true,
        disabled: false,
      }));
    } else {
      this.chips = [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /* =========================
     UI Actions
  ========================= */

  addChip(): void {
    const value = this.inputValue?.trim();
    if (!value) return;

    this.chips.push({
      label: value,
      value: value,
      selected: true,
      disabled: false,
    });

    this.inputValue = '';
    this.propagateChanges();
  }

  removeChip(chip: ChipItem): void {
    if (this.disabled) return;

    this.chips = this.chips.filter((c) => c !== chip);
    this.propagateChanges();
  }

  toggleSelection(chip: ChipItem): void {
    if (this.disabled || chip.disabled) return;

    chip.selected = !chip.selected;
    this.propagateChanges();
  }

  private propagateChanges(): void {
    const selectedValues = this.chips.filter((c) => c.selected);

    this.onChange(selectedValues);
    this.onTouched();
  }
}
