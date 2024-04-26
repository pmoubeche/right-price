import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundNumberDecimal',
  standalone: true,
})
export class RoundNumberDecimalPipe implements PipeTransform {
  static transform(value: number, decimal: 0 | 1 | 2 | 3): number {
    switch (decimal) {
      case 0:
        return Math.round(value);
      case 1:
        return Math.round(value * 10) / 10;
      case 2:
        return Math.round(value * 100) / 100;
      case 3:
        return Math.round(value * 1000) / 1000;
    }
  }

  transform(value: number, decimal: 0 | 1 | 2 | 3): number {
    return RoundNumberDecimalPipe.transform(value, decimal);
  }
}
