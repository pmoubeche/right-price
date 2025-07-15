import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { PercentFormatPipe } from './shared/pipes/percent-format.pipe';
import { RoundNumberDecimalPipe } from './shared/pipes/round-number-decimal.pipe';
import { UppercaseFirstLetterFormatPipe } from './shared/pipes/uppercase-first-letter-format.pipe';
import { OpenFoodFactsApiService } from './shared/services/openfoodfact-api.service';
import { DefaultMatCalendarRangeStrategy } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared/material/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    PercentFormatPipe,
    RoundNumberDecimalPipe,
    UppercaseFirstLetterFormatPipe,
    OpenFoodFactsApiService,
    DefaultMatCalendarRangeStrategy,
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      MaterialModule,
      TablerIconsModule.pick(TablerIcons)
    ),
    provideToastr(),
  ],
};
