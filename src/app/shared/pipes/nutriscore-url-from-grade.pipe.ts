import { Pipe, PipeTransform } from '@angular/core';
import { NutriscoreGrade } from '../enum/score-grade.enum';
import { NutriscoreLinks } from '../enum/svg-urls.enum';

@Pipe({
  name: 'nutriscoreUrlFromGrade',
  standalone: true,
})
export class NutriscoreUrlFromGradePipe implements PipeTransform {
  transform(grade: string): string {
    switch (grade) {
      case NutriscoreGrade.A:
        return NutriscoreLinks.NUTRISCORE_A;
      case NutriscoreGrade.B:
        return NutriscoreLinks.NUTRISCORE_B;
      case NutriscoreGrade.C:
        return NutriscoreLinks.NUTRISCORE_C;
      case NutriscoreGrade.D:
        return NutriscoreLinks.NUTRISCORE_D;
      case NutriscoreGrade.E:
        return NutriscoreLinks.NUTRISCORE_E;
      case NutriscoreGrade.UNKNOWN:
        return NutriscoreLinks.NUTRISCORE_UNKNOWN;
      default:
        return NutriscoreLinks.NUTRISCORE_UNKNOWN;
    }
  }
}
