import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Price } from './pricing.component';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../shared/components/dialogs/dialog-generic.service';

@Injectable({ providedIn: 'root' })
export class PricingService {
  prices: Price[] = [
    {
      title: 'Gratuit',
      price: '0€',
      features: [
        'Recherche et détails des aliments',
        'Compartif nutritionnel entre 2 aliments',
      ],
      link: "S'inscrire gratuitement",
      action: () => this.redirectRegister(),
    },
    {
      title: 'Tier 1',
      price: '7,99€',
      features: [
        'Recherche et détails des aliments',
        'Compartif nutritionnel entre 2 aliments',
        'Création des repas et dashboard journalier',
        'Export de la liste de courses associée',
      ],
      link: "S'abonner",
      action: () => this.redirectRegister(),
    },
    {
      title: 'Tier 2',
      price: '12,99€',
      features: [
        'Recherche et détails des aliments',
        'Compartif nutritionnel entre 2 aliments',
        'Création des repas et dashboard journalier',
        'Export de la liste de courses associée',
        'Import des Glucose Continuous Monitoring',
        'Vusialisation journaliere du CGM',
        'Récapitulatif journalier des apports',
      ],
      link: "S'abonner",
      action: () => this.redirectRegister(),
    },
  ];

  constructor(private readonly dialogService: DialogGenericService) {}

  getPrices(): Observable<Price[]> {
    return of(this.prices);
  }

  redirectRegister(): void {
    this.dialogService.openDialog(CodeModaleEnum.SIGNUP);
  }
}
