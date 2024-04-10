import { OpenFoodFactsApiService } from './openfoodfact-api.service';

export class SearchProductService {
  constructor(
    private readonly openFoodFactApiService: OpenFoodFactsApiService
  ) {}
}
