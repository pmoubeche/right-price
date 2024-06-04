import { AbstractControl } from '@angular/forms';

export class FormsUtils {
  /**
   * Renvoie la date associée à un champ de formulaire de type range date field
   * @param formField le champ du formulaire
   * @param index l'index de la date (0 pour la date de début, 1 pour la date de fin)
   * @returns la date
   */
  public static getDateFromRangeDateField(
    formField: AbstractControl | null,
    index: number
  ): string | undefined {
    return formField?.value?.[index]
      ? new Date(formField.value[index]).toISOString()
      : undefined;
  }

  /**
   * Renvoie la date de début associée à un champ de formulaire de type range date field
   * @param formField le champ du formulaire
   * @returns la date de début
   */
  public static getStartDateFromRangeDateField(
    formField: AbstractControl | null
  ): string | undefined {
    return this.getDateFromRangeDateField(formField, 0);
  }

  /**
   * Renvoie la date fin associée à un champ de formulaire de type range date field
   * @param formField le champ du formulaire
   * @returns la date de fin si présente, sinon, la date de début
   */
  public static getEndDateFromRangeDateField(
    formField: AbstractControl | null
  ): string | undefined {
    const endDate = this.getDateFromRangeDateField(formField, 1);
    return endDate ?? this.getStartDateFromRangeDateField(formField);
  }
}
