import { formatDate } from '@angular/common';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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

  static dateWithTimeZoneParis(dateString: string): number {
    return dayjs.tz(dateString, 'Europe/Paris').valueOf();
  }

  static fromTimeStringToMapTime(timeString: string): {
    hours: number;
    minutes: number;
  } {
    const timeSplit = timeString
      .split(':')
      .map((time) => Number.parseFloat(time));
    return {
      hours: timeSplit[0],
      minutes: timeSplit[1],
    };
  }

  static dateStringWithoutOffesetTimeZone(date: Date): string {
    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    ).toISOString();
  }

  static parseDateFromString(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  static getHoursMinutesFromDateString(date: string) {
    const d = new Date(date);

    // Format HH:mm
    const hours = d.getUTCHours().toString().padStart(2, '0');
    const minutes = d.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
