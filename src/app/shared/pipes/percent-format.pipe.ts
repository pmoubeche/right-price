import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentFormat',
  standalone: true,
})
export class PercentFormatPipe implements PipeTransform {
  static transform(percent: number, multiply: 1 | 100): string {
    return `${Math.round(percent * 100 * multiply) / 100} %`;
  }

  transform(percent: number, multiply: 1 | 100): string {
    return PercentFormatPipe.transform(percent, multiply);
  }
}
