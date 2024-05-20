import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimString',
  standalone: true,
})
export class TrimStringPipe implements PipeTransform {
  transform(value: string, trimNumber: number): string {
    return value.length > trimNumber
      ? `${value.substring(0, trimNumber)} ...`
      : value;
  }
}
