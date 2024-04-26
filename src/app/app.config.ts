import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { PercentFormatPipe } from './shared/pipes/percent-format.pipe';
import { UppercaseFirstLetterFormatPipe } from './shared/pipes/uppercase-first-letter-format.pipe';
import { OpenFoodFactsApiService } from './shared/services/openfoodfact-api.service';
import { RoundNumberDecimalPipe } from './shared/pipes/round-number-decimal.pipe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    PercentFormatPipe,
    RoundNumberDecimalPipe,
    UppercaseFirstLetterFormatPipe,
    OpenFoodFactsApiService,
  ],
};
