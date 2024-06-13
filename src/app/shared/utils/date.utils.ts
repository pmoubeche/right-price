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

  /**
   * Méthode qui permet de ne pas avoir la conversion des -1j par la conversion ISO
   * @param date : date à convertir
   */
  static formatDateMinus1(date: Date): Date {
    return new Date(
      date.getTime() + Math.abs(date.getTimezoneOffset() * 60000)
    );
  }
}
