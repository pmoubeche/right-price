import { Component } from '@angular/core';
import { RapidSearchProductComponent } from './rapid-search-product/rapid-search-product.component';
import { SearchProductComponent } from '../product/search-product/search-product.component';

@Component({
  selector: 'app-meal',
  standalone: true,
  imports: [RapidSearchProductComponent, SearchProductComponent],
  templateUrl: './meal.component.html',
  styleUrl: './meal.component.scss',
})
export class MealComponent {}
