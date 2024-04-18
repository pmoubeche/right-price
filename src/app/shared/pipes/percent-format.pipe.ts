import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentFormat',
  standalone: true,
})
export class PercentFormatPipe implements PipeTransform {
  transform(percent: number): string {
    return `${Math.round(percent * 100) / 100} %`;
  }
}
