import { NutrimentInfoModel } from '../../features/product/detail-product/detail-product.component';
import {
  EcoscoreGrade,
  NovagroupGrade,
  NutriscoreGrade,
} from '../enum/score-grade.enum';
import {
  EcoscoreLinks,
  NovagroupLinks,
  NutriscoreLinks,
} from '../enum/svg-urls.enum';
import { Nutriments } from '../model/product.model';

export class ProductUtils {
  static getUrlNutriscore(grade: string): string {
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

  static getUrlEcoscore(grade: string): string {
    switch (grade) {
      case EcoscoreGrade.A:
        return EcoscoreLinks.ECOSCORE_A;
      case EcoscoreGrade.B:
        return EcoscoreLinks.ECOSCORE_B;
      case EcoscoreGrade.C:
        return EcoscoreLinks.ECOSCORE_C;
      case EcoscoreGrade.D:
        return EcoscoreLinks.ECOSCORE_D;
      case EcoscoreGrade.UNKNOWN:
        return EcoscoreLinks.ECOSCORE_UNKNOWN;
      default:
        return EcoscoreLinks.ECOSCORE_UNKNOWN;
    }
  }

  static getUrlNovagroup(grade: number): string {
    switch (grade) {
      case NovagroupGrade.GRADE_1:
        return NovagroupLinks.NOVAGROUP_1;
      case NovagroupGrade.GRADE_2:
        return NovagroupLinks.NOVAGROUP_2;
      case NovagroupGrade.GRADE_3:
        return NovagroupLinks.NOVAGROUP_3;
      case NovagroupGrade.GRADE_4:
        return NovagroupLinks.NOVAGROUP_4;
      case NovagroupGrade.UNKNOWN:
        return NovagroupLinks.NOVAGROUP_UNKNOWN;
      default:
        return NovagroupLinks.NOVAGROUP_UNKNOWN;
    }
  }

  static setNutrimentsTable(nutriment: Nutriments): NutrimentInfoModel[] {
    return [
      {
        id: '0',
        nutriment: 'Energie (kJ)',
        value: `${nutriment['energy-kj_100g']?.toString()} ${
          nutriment['energy-kj_unit']
        }`,
      },
      {
        id: '1',
        nutriment: 'Energie (kcal)',
        value: `${nutriment['energy-kcal_100g']?.toString()} ${
          nutriment['energy-kcal_unit']
        }`,
      },
      {
        id: '2',
        nutriment: 'Matières grasses',
        value: `${nutriment['fat_100g']?.toString()} ${nutriment['fat_unit']}`,
      },
      {
        id: '3',
        nutriment: '--Acides gras saturés',
        value: `${nutriment['saturated-fat_100g']?.toString()} ${
          nutriment['saturated-fat_unit']
        }`,
      },
      {
        id: '4',
        nutriment: 'Glucides',
        value: `${nutriment['carbohydrates_100g']?.toString()} ${
          nutriment['carbohydrates_unit']
        }`,
      },
      {
        id: '5',
        nutriment: '--Sucres',
        value: `${nutriment['sugars_100g']?.toString()} ${
          nutriment['sugars_unit']
        }`,
      },
      {
        id: '6',
        nutriment: '--Fibres alimentaires',
        value: `${nutriment['fiber_100g']?.toString()} ${
          nutriment['fiber_unit']
        }`,
      },
      {
        id: '7',
        nutriment: 'Protéines',
        value: `${nutriment['proteins_100g']?.toString()} ${
          nutriment['proteins_unit']
        }`,
      },
      {
        id: '8',
        nutriment: 'Sel',
        value: `${nutriment['salt_100g']?.toString()} ${
          nutriment['salt_unit']
        }`,
      },
    ];
  }

  static setNutrimentChartPieMap(nutriment: Nutriments): Map<string, number> {
    const leftoversProp =
      100 -
      (nutriment['fat_100g']! +
        nutriment['carbohydrates_100g']! +
        nutriment['proteins_100g']!);
    return new Map<string, number>([
      ['Matières grasses', nutriment['fat_100g']!],
      ['Glucides', nutriment['carbohydrates_100g']!],
      ['Protéines', nutriment['proteins_100g']!],
      ['Restes', leftoversProp],
    ]);
  }
}
