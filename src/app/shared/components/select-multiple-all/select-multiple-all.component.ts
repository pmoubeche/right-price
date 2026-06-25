import { CommonModule } from '@angular/common';
import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

export interface CodeLabel {
  code: string;
  label: string;
}

@Component({
  selector: 'app-select-multiple-all',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
  ],
  templateUrl: './select-multiple-all.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMultipleAllComponent),
      multi: true,
    },
  ],
})
export class SelectMultipleAllComponent implements ControlValueAccessor {
  // Inputs en signal
  label = input<string>('Select');
  options = input<CodeLabel[]>([]);
  multiple = input<boolean>(false);
  enableSelectAll = input<boolean>(false);

  value: CodeLabel[] = [];
  disabled = false;

  private onChange: (value: CodeLabel[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: CodeLabel[] | null): void {
    this.value = value ?? [];
  }

  registerOnChange(fn: (value: CodeLabel[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  compareByCode = (a: CodeLabel, b: CodeLabel): boolean => a?.code === b?.code;

  onSelectionChange(value: CodeLabel[]): void {
    this.value = value ?? [];
    this.onChange(this.value);
    this.onTouched();
  }

  toggleSelectAll(): void {
    if (!this.multiple()) return;

    const allOptions = this.options();
    const isAllSelected = this.value.length === allOptions.length;

    const newValue = isAllSelected ? [] : [...allOptions];

    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
  }

  isAllSelected(): boolean {
    if (!this.multiple()) return false;
    return this.value.length === this.options().length;
  }

  isIndeterminate(): boolean {
    if (!this.multiple()) return false;

    const selectedCount = this.value.length;
    const total = this.options().length;

    return selectedCount > 0 && selectedCount < total;
  }
}
