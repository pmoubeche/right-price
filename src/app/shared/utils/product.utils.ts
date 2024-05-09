import { Injectable } from '@angular/core';
import { NutrimentInfoModel } from '../../features/product/detail-product/detail-product.component';
import { MicroNutrimentsConst } from '../enum/recomandation-nutriment.enum';
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
import { Nutriments, Product } from '../model/product.model';
import { RoundNumberDecimalPipe } from '../pipes/round-number-decimal.pipe';

export class ProductUtils {
  public static readonly UNIT_GRAMME = 'g';
  public static readonly UNIT_MILLIGRAMME = 'mg';
  public static readonly UNIT_MICROGRAMME = 'µg';

  public static readonly UNIT_KJ = 'kJ';
  public static readonly UNIT_KCAL = 'kcal';

  constructor(private readonly roundNumberPipe: RoundNumberDecimalPipe) {}

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

  static setMacroNutrimentsTable(nutriment: Nutriments): NutrimentInfoModel[] {
    return [
      {
        id: '0',
        nutriment: 'Energie (kJ)',
        value: `${RoundNumberDecimalPipe.transform(
          nutriment['energy-kj_100g']!,
          2
        ).toString()} ${this.UNIT_KJ}`,
      },
      {
        id: '1',
        nutriment: 'Energie (kcal)',
        value: `${RoundNumberDecimalPipe.transform(
          nutriment['energy-kcal_100g']!,
          2
        ).toString()} ${this.UNIT_KCAL}`,
      },
      {
        id: '2',
        nutriment: 'Matières grasses',
        value: `${RoundNumberDecimalPipe.transform(
          nutriment['fat_100g']!,
          2
        ).toString()} ${this.UNIT_GRAMME}`,
      },
      {
        id: '3',
        nutriment: '--Acides gras saturés',
        value: `${RoundNumberDecimalPipe.transform(
          nutriment['saturated-fat_100g']!,
          2
        ).toString()} ${this.UNIT_GRAMME}`,
      },
      {
        id: '4',
        nutriment: 'Glucides',
        value: `${RoundNumberDecimalPipe.transform(
          nutriment['carbohydrates_100g']!,
          2
        ).toString()} ${this.UNIT_GRAMME}`,
      },
      {
        id: '5',
        nutriment: '--Sucres',
        value: `${RoundNumberDecimalPipe.transform(
          nutriment['sugars_100g']!,
          2
        ).toString()} ${this.UNIT_GRAMME}`,
      },
      {
        id: '6',
        nutriment: '--Fibres alimentaires',
        value: `${RoundNumberDecimalPipe.transform(
          nutriment['fiber_100g']!,
          2
        ).toString()} ${this.UNIT_GRAMME}`,
      },
      {
        id: '7',
        nutriment: 'Protéines',
        value: `${RoundNumberDecimalPipe.transform(
          nutriment['proteins_100g']!,
          2
        ).toString()} ${this.UNIT_GRAMME}`,
      },
      {
        id: '8',
        nutriment: 'Sel',
        value: `${RoundNumberDecimalPipe.transform(
          nutriment['salt_100g']!,
          2
        ).toString()} ${this.UNIT_GRAMME}`,
      },
    ];
  }

  static setMicroNutrimentsTable(nutriment: Nutriments): NutrimentInfoModel[] {
    return [
      {
        id: '1',
        nutriment: MicroNutrimentsConst.CHOLESTEROL.label,
        value: this.convertMasseUnit(nutriment['cholesterol_100g']!),
        ajr:
          MicroNutrimentsConst.CHOLESTEROL.value +
          MicroNutrimentsConst.CHOLESTEROL.unit,
        percentAjr_100g:
          nutriment['cholesterol_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.CHOLESTEROL.value,
            MicroNutrimentsConst.CHOLESTEROL.unit
          ),
      },
      {
        id: '2',
        nutriment: MicroNutrimentsConst.CALCIUM.label,
        value: this.convertMasseUnit(nutriment['calcium_100g']!),
        ajr:
          MicroNutrimentsConst.CALCIUM.value +
          MicroNutrimentsConst.CALCIUM.unit,
        percentAjr_100g:
          nutriment['calcium_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.CALCIUM.value,
            MicroNutrimentsConst.CALCIUM.unit
          ),
      },
      {
        id: '3',
        nutriment: MicroNutrimentsConst.ZINC.label,
        value: this.convertMasseUnit(nutriment['zinc_100g']!),
        ajr: MicroNutrimentsConst.ZINC.value + MicroNutrimentsConst.ZINC.unit,
        percentAjr_100g:
          nutriment['zinc_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.ZINC.value,
            MicroNutrimentsConst.ZINC.unit
          ),
      },
      {
        id: '4',
        nutriment: MicroNutrimentsConst.SODIUM.label,
        value: this.convertMasseUnit(nutriment['sodium_100g']!),
        ajr:
          MicroNutrimentsConst.SODIUM.value + MicroNutrimentsConst.SODIUM.unit,
        percentAjr_100g:
          nutriment['sodium_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.SODIUM.value,
            MicroNutrimentsConst.SODIUM.unit
          ),
      },
      {
        id: '5',
        nutriment: MicroNutrimentsConst.POTASSIUM.label,
        value: this.convertMasseUnit(nutriment['potassium_100g']!),
        ajr:
          MicroNutrimentsConst.POTASSIUM.value +
          MicroNutrimentsConst.POTASSIUM.unit,
        percentAjr_100g:
          nutriment['potassium_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.POTASSIUM.value,
            MicroNutrimentsConst.POTASSIUM.unit
          ),
      },
      {
        id: '6',
        nutriment: MicroNutrimentsConst.PHOSPHORE.label,
        value: this.convertMasseUnit(nutriment['phosphorus_100g']!),
        ajr:
          MicroNutrimentsConst.PHOSPHORE.value +
          MicroNutrimentsConst.PHOSPHORE.unit,
        percentAjr_100g:
          nutriment['phosphorus_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.PHOSPHORE.value,
            MicroNutrimentsConst.PHOSPHORE.unit
          ),
      },
      {
        id: '7',
        nutriment: MicroNutrimentsConst.MANGANESE.label,
        value: this.convertMasseUnit(nutriment['manganese_100g']!),
        ajr:
          MicroNutrimentsConst.MANGANESE.value +
          MicroNutrimentsConst.MANGANESE.unit,
        percentAjr_100g:
          nutriment['manganese_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.MANGANESE.value,
            MicroNutrimentsConst.MANGANESE.unit
          ),
      },
      {
        id: '8',
        nutriment: MicroNutrimentsConst.MAGNESIUM.label,
        value: this.convertMasseUnit(nutriment['magnesium_100g']!),
        ajr:
          MicroNutrimentsConst.MAGNESIUM.value +
          MicroNutrimentsConst.MAGNESIUM.unit,
        percentAjr_100g:
          nutriment['magnesium_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.MAGNESIUM.value,
            MicroNutrimentsConst.MAGNESIUM.unit
          ),
      },
      {
        id: '9',
        nutriment: MicroNutrimentsConst.FER.label,
        value: this.convertMasseUnit(nutriment['iron_100g']!),
        ajr: MicroNutrimentsConst.FER.value + MicroNutrimentsConst.FER.unit,
        percentAjr_100g:
          nutriment['iron_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.FER.value,
            MicroNutrimentsConst.FER.unit
          ),
      },
      {
        id: '10',
        nutriment: MicroNutrimentsConst.VITAMINE_A.label,
        value: this.convertMasseUnit(nutriment['vitamin-a_100g']!),
        ajr:
          MicroNutrimentsConst.VITAMINE_A.value +
          MicroNutrimentsConst.VITAMINE_A.unit,
        percentAjr_100g:
          nutriment['vitamin-a_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_A.value,
            MicroNutrimentsConst.VITAMINE_A.unit
          ),
      },
      {
        id: '11',
        nutriment: MicroNutrimentsConst.VITAMINE_B12.label,
        value: this.convertMasseUnit(nutriment['vitamin-b12_100g']!),
        ajr:
          MicroNutrimentsConst.VITAMINE_B12.value +
          MicroNutrimentsConst.VITAMINE_B12.unit,
        percentAjr_100g:
          nutriment['vitamin-b12_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B12.value,
            MicroNutrimentsConst.VITAMINE_B12.unit
          ),
      },
      {
        id: '12',
        nutriment: MicroNutrimentsConst.VITAMINE_B1.label,
        value: this.convertMasseUnit(nutriment['vitamin-b1_100g']!),
        ajr:
          MicroNutrimentsConst.VITAMINE_B1.value +
          MicroNutrimentsConst.VITAMINE_B1.unit,
        percentAjr_100g:
          nutriment['vitamin-b1_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B1.value,
            MicroNutrimentsConst.VITAMINE_B1.unit
          ),
      },
      {
        id: '13',
        nutriment: MicroNutrimentsConst.VITAMINE_B2.label,
        value: this.convertMasseUnit(nutriment['vitamin-b2_100g']!),
        ajr:
          MicroNutrimentsConst.VITAMINE_B2.value +
          MicroNutrimentsConst.VITAMINE_B2.unit,
        percentAjr_100g:
          nutriment['vitamin-b2_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B2.value,
            MicroNutrimentsConst.VITAMINE_B2.unit
          ),
      },
      {
        id: '14',
        nutriment: MicroNutrimentsConst.VITAMINE_B6.label,
        value: this.convertMasseUnit(nutriment['vitamin-b6_100g']!),
        ajr:
          MicroNutrimentsConst.VITAMINE_B6.value +
          MicroNutrimentsConst.VITAMINE_B6.unit,
        percentAjr_100g:
          nutriment['vitamin-b6_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B6.value,
            MicroNutrimentsConst.VITAMINE_B6.unit
          ),
      },
      {
        id: '15',
        nutriment: MicroNutrimentsConst.VITAMINE_B9.label,
        value: this.convertMasseUnit(nutriment['vitamin-b9_100g']!),
        ajr:
          MicroNutrimentsConst.VITAMINE_B9.value +
          MicroNutrimentsConst.VITAMINE_B9.unit,
        percentAjr_100g:
          nutriment['vitamin-b9_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B9.value,
            MicroNutrimentsConst.VITAMINE_B9.unit
          ),
      },
      {
        id: '16',
        nutriment: MicroNutrimentsConst.VITAMINE_C.label,
        value: this.convertMasseUnit(nutriment['vitamin-c_100g']!),
        ajr:
          MicroNutrimentsConst.VITAMINE_C.value +
          MicroNutrimentsConst.VITAMINE_C.unit,
        percentAjr_100g:
          nutriment['vitamin-c_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_C.value,
            MicroNutrimentsConst.VITAMINE_C.unit
          ),
      },
      {
        id: '17',
        nutriment: MicroNutrimentsConst.VITAMINE_D.label,
        value: this.convertMasseUnit(nutriment['vitamin-d_100g']!),
        ajr:
          MicroNutrimentsConst.VITAMINE_D.value +
          MicroNutrimentsConst.VITAMINE_D.unit,
        percentAjr_100g:
          nutriment['vitamin-d_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_D.value,
            MicroNutrimentsConst.VITAMINE_D.unit
          ),
      },
    ];
  }

  static setSugarsTable(nutriment: Nutriments): NutrimentInfoModel[] {
    return [
      {
        id: '0',
        nutriment: 'Fructose',
        value: this.convertMasseUnit(nutriment['fructose_100g']!),
      },
      {
        id: '1',
        nutriment: 'Galactose',
        value: this.convertMasseUnit(nutriment['galactose_100g']!),
      },
      {
        id: '2',
        nutriment: 'Glucose',
        value: this.convertMasseUnit(nutriment['glucose_100g']!),
      },
      {
        id: '3',
        nutriment: 'Lactose',
        value: this.convertMasseUnit(nutriment['lactose_100g']!),
      },
      {
        id: '4',
        nutriment: 'Maltose',
        value: this.convertMasseUnit(nutriment['maltose_100g']!),
      },
      {
        id: '5',
        nutriment: 'Sucrose',
        value: this.convertMasseUnit(nutriment['sucrose_100g']!),
      },
      {
        id: '6',
        nutriment: 'Saccharose',
        value: this.convertMasseUnit(nutriment['saccharose_100g']!),
      },
    ];
  }

  static setMacroNutrimentChartPieMap(
    nutriment: Nutriments
  ): Map<string, number> {
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

  static setNutrimentChartPieMap(nutriment: Nutriments): Map<string, number> {
    if (Object.keys(nutriment).length > 0) {
      return new Map<string, number>([
        ['Calories', nutriment['energy-kcal_100g']!],
        ['Lipides', nutriment['fat_100g']!],
        ['Glucides', nutriment['carbohydrates_100g']!],
        ['Protéines', nutriment['proteins_100g']!],
        ['Fibres', nutriment['fiber_100g']!],
        ['Sel', nutriment['salt_100g']!],
      ]);
    }
    return new Map<string, number>([
      ['Energie', 0],
      ['Lipides', 0],
      ['Glucides', 0],
      ['Protéines', 0],
      ['Fibres', 0],
      ['Sel', 0],
    ]);
  }

  static setSugarsChartPieMap(nutriment: Nutriments): Map<string, number> {
    return new Map<string, number>([
      ['Fructose', nutriment['fructose_100g']!],
      ['Glucose', nutriment['glucose_100g']!],
      ['Maltose', nutriment['maltose_100g']!],
      ['Sucrose', nutriment['sucrose_100g']!],
      ['Galactose', nutriment['galactose_100g']!],
      ['Lactose', nutriment['lactose_100g']!],
      ['Saccharose', nutriment['saccharose_100g']!],
    ]);
  }

  static setMicroNutrimentsChartMap(
    nutriment: Nutriments
  ): Map<string, number> {
    return new Map<string, number>([
      [
        MicroNutrimentsConst.CHOLESTEROL.label,
        nutriment['cholesterol_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.CHOLESTEROL.value,
            MicroNutrimentsConst.CHOLESTEROL.unit
          ),
      ],
      [
        MicroNutrimentsConst.CALCIUM.label,
        nutriment['calcium_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.CALCIUM.value,
            MicroNutrimentsConst.CALCIUM.unit
          ),
      ],
      [
        MicroNutrimentsConst.SODIUM.label,
        nutriment['sodium_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.SODIUM.value,
            MicroNutrimentsConst.SODIUM.unit
          ),
      ],
      [
        MicroNutrimentsConst.POTASSIUM.label,
        nutriment['potassium_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.POTASSIUM.value,
            MicroNutrimentsConst.POTASSIUM.unit
          ),
      ],
      [
        MicroNutrimentsConst.ZINC.label,
        nutriment['zinc_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.ZINC.value,
            MicroNutrimentsConst.ZINC.unit
          ),
      ],
      [
        MicroNutrimentsConst.PHOSPHORE.label,
        nutriment['phosphorus_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.PHOSPHORE.value,
            MicroNutrimentsConst.PHOSPHORE.unit
          ),
      ],
      [
        MicroNutrimentsConst.MANGANESE.label,
        nutriment['manganese_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.MANGANESE.value,
            MicroNutrimentsConst.MANGANESE.unit
          ),
      ],
      [
        MicroNutrimentsConst.MAGNESIUM.label,
        nutriment['magnesium_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.MAGNESIUM.value,
            MicroNutrimentsConst.MAGNESIUM.unit
          ),
      ],
      [
        MicroNutrimentsConst.FER.label,
        nutriment['iron_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.FER.value,
            MicroNutrimentsConst.FER.unit
          ),
      ],
      [
        MicroNutrimentsConst.VITAMINE_A.label,
        nutriment['vitamin-a_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_A.value,
            MicroNutrimentsConst.VITAMINE_A.unit
          ),
      ],
      [
        MicroNutrimentsConst.VITAMINE_B1.label,
        nutriment['vitamin-b1_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B1.value,
            MicroNutrimentsConst.VITAMINE_B1.unit
          ),
      ],
      [
        MicroNutrimentsConst.VITAMINE_B2.label,
        nutriment['vitamin-b2_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B2.value,
            MicroNutrimentsConst.VITAMINE_B2.unit
          ),
      ],
      [
        MicroNutrimentsConst.VITAMINE_B6.label,
        nutriment['vitamin-b6_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B6.value,
            MicroNutrimentsConst.VITAMINE_B6.unit
          ),
      ],
      [
        MicroNutrimentsConst.VITAMINE_B9.label,
        nutriment['vitamin-b9_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B9.value,
            MicroNutrimentsConst.VITAMINE_B9.unit
          ),
      ],
      [
        MicroNutrimentsConst.VITAMINE_B12.label,
        nutriment['vitamin-b12_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_B12.value,
            MicroNutrimentsConst.VITAMINE_B12.unit
          ),
      ],
      [
        MicroNutrimentsConst.VITAMINE_C.label,
        nutriment['vitamin-c_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_C.value,
            MicroNutrimentsConst.VITAMINE_C.unit
          ),
      ],
      [
        MicroNutrimentsConst.VITAMINE_D.label,
        nutriment['vitamin-d_100g']! /
          this.convertMasseToGramme(
            MicroNutrimentsConst.VITAMINE_D.value,
            MicroNutrimentsConst.VITAMINE_D.unit
          ),
      ],
    ]);
  }

  static setNutrimentsEstimatedIfNutrimentsUndefined(
    product: Product
  ): Nutriments {
    return product.nutriments_estimated
      ? product.nutriments_estimated!
      : product.nutriments!;
  }

  static convertMasseUnit(value: number): string {
    switch (true) {
      case value > 1 || value === 0:
        return `${Math.round(value)} ${this.UNIT_GRAMME}`;
      case value > 0.001 && value < 0.999:
        return `${Math.round(value * 1000)} ${this.UNIT_MILLIGRAMME}`;
      case value > 0.000001 && value < 0.000999:
        return `${Math.round(value * 1000000)} ${this.UNIT_MICROGRAMME}`;
      default:
        return `${Math.round(value)}  ${this.UNIT_GRAMME}`;
    }
  }

  static convertMasseToGramme(value: number, unit: string): number {
    switch (true) {
      case unit === ProductUtils.UNIT_MILLIGRAMME:
        return value * 0.001;
      case unit === ProductUtils.UNIT_MICROGRAMME:
        return value * 0.000001;
      default:
        return value;
    }
  }
}
