import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  readonly DATE_SEPARATOR = '-';

  transform(date: Date): string {
    return formatDate(
      date,
      `dd${this.DATE_SEPARATOR}MM${this.DATE_SEPARATOR}yyyy`,
      'en'
    );
  }
}
