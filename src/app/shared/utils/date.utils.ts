import { formatDate } from '@angular/common';

export class DateUtils {
  static DATE_SEPARATOR = '-';

  static formatDate(date: Date): string {
    return formatDate(
      date,
      `dd${this.DATE_SEPARATOR}MM${this.DATE_SEPARATOR}yyyy`,
      'en'
    );
  }
}
