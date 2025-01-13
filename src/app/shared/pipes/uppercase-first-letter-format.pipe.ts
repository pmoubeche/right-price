import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'uppercaseFirstLetterFormat',
  standalone: true,
})
export class UppercaseFirstLetterFormatPipe implements PipeTransform {
  transform(value?: string): string {
    return UppercaseFirstLetterFormatPipe.transform(value);
  }

  static transform(value?: string): string {
    if (!value) {
      return '';
    }
    return value!.charAt(0).toUpperCase() + value!.slice(1);
  }
}
