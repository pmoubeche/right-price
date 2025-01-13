import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { PricingService } from './pricing.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

export class Price {
  title?: string;
  price?: string;
  features?: string[];
  link?: string;
  action!: () => void;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class SubscriptionComponent implements OnInit {
  title = 'Choisissez votre offre';
  description =
    "Envie d'en savoir plus sur votre alimentation ? Choisissez l'offre qui vous correspond !";
  public prices$: Observable<Price[]> = this.pricingService.getPrices();

  constructor(private readonly pricingService: PricingService) {}

  ngOnInit() {}
}
