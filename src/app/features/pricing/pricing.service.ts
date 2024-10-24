import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../shared/components/dialogs/dialog-generic.service';
import { Price } from './pricing.component';

@Injectable({ providedIn: 'root' })
export class PricingService {
  prices: Price[] = [
    {
      title: 'Découvrir',
      price: '0€',
      features: [
        'Recherche et détails des aliments',
        'Compartif nutritionnel entre 2 aliments',
      ],
      link: "S'inscrire gratuitement",
      action: () => this.redirectRegister(),
    },
    {
      title: 'Niveau 1',
      price: '7,99€',
      features: [
        'Recherche et détails des aliments',
        'Compartif nutritionnel entre 2 aliments',
        'Création des repas et dashboard journalier',
        'Export de la liste de courses associée',
      ],
      link: "S'abonner",
      action: () => this.subscribeTier1(),
    },
    {
      title: 'Niveau 2',
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
      action: () => this.subscribeTier2(),
    },
  ];

  constructor(private readonly dialogService: DialogGenericService) {}

  getPrices(): Observable<Price[]> {
    return of(this.prices);
  }

  redirectRegister(): void {
    this.dialogService.openDialog(CodeModaleEnum.SIGNUP);
  }

  subscribeTier1(): void {
    this.dialogService.openDialog(CodeModaleEnum.EXTERNAL_LINK, {
      url: 'https://datafood.lemonsqueezy.com/buy/10d8c623-2df5-48fc-aaf4-95f243906f43?embed=1&discount=0',
    });
  }

  subscribeTier2(): void {
    this.dialogService.openDialog(CodeModaleEnum.EXTERNAL_LINK, {
      url: 'https://datafood.lemonsqueezy.com/buy/05bad941-d342-4ffa-85ce-5f0cf41be760?embed=1&discount=0',
    });
  }
}
