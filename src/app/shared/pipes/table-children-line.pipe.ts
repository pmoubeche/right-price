import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableChildrenLine',
})
export class TableChildrenLinePipe implements PipeTransform {
  transform(value: string): string {
    if (value && value.startsWith('--')) {
      return value.replace('--', '');
    }

    return value;
  }
}
