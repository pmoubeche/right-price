import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { RefreshTokenService } from '../../../generated';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../shared/components/dialogs/dialog-generic.service';
import { RoleTier1, RoleTier2 } from '../../shared/constants/role.constant';
import { MaterialModule } from '../../shared/material/material.module';
import { AuthServiceFront } from '../../shared/services/auth-front.service';
import { ContextService } from '../../shared/services/context.service';
import { TokenStorageService } from '../../shared/services/token-storage.service';
import { TablerIconsModule } from 'angular-tabler-icons';

export class Sub {
  type?: string;
  class?: string;
  title?: string;
  price?: string;
  features?: string[];
  link?: string;
  buttonDisplayed$?: Observable<boolean>;
  action!: () => void;
}

@Component({
  standalone: true,
  selector: 'app-pricing',
  imports: [MaterialModule, CommonModule, TablerIconsModule],
  templateUrl: './subscribe.component.html',
})
export class SubscriptionComponent implements OnInit, OnDestroy {
  readonly GUEST = 'GUEST';
  readonly TIER1 = 'TIER1';
  readonly TIER2 = 'TIER2';

  title = 'Choisissez votre offre';
  description =
    "Envie d'en savoir plus sur votre alimentation ? Choisissez l'offre qui vous correspond !";

  private guestFeatures = [
    'Recherche et détails des aliments',
    'Compartif nutritionnel entre 2 aliments',
    'Enregistrement des aliments favoris',
  ];

  private tier1Features = [
    ...this.guestFeatures,
    'Création des repas et dashboard journalier',
    'Export de la liste de courses associée',
  ];

  private tier2Features = [
    ...this.tier1Features,
    'Import des Glucose Continuous Monitoring',
    'Vusialisation journaliere du CGM',
    'Récapitulatif journalier des apports',
  ];

  public prices: Sub[] = [
    {
      type: this.GUEST,
      class: 'bg-light-primary text-primary rounded f-w-600 p-6 p-y-4 f-s-16',
      title: 'Découvrir',
      price: '0€',
      features: this.guestFeatures,
      buttonDisplayed$: of(true),
      link: "S'inscrire gratuitement",
      action: () => this.redirectRegister(),
    },
    {
      type: this.TIER1,
      class: 'bg-light-success text-success rounded f-w-600 p-6 p-y-4 f-s-16',
      title: 'Niveau 1',
      price: '7,99€',
      features: this.tier1Features,
      buttonDisplayed$: of(true),
      link: "S'abonner",
      action: () => this.subscribeTier1(),
    },
    {
      type: this.TIER2,
      class: 'bg-light-warning text-warning rounded f-w-600 p-6 p-y-4 f-s-16',
      title: 'Niveau 2',
      price: '12,99€',
      features: this.tier2Features,
      buttonDisplayed$: of(true),
      link: "S'abonner",
      action: () => this.subscribeTier2(),
    },
  ];

  redirectOriginUrl?: string;

  private subscriptionRxjs = new Subscription();

  constructor(
    private readonly dialogService: DialogGenericService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly tokenService: TokenStorageService,
    private readonly contexteService: ContextService,
    private readonly authFrontService: AuthServiceFront,
    private readonly ar: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.ar.queryParams.subscribe((param) => {
      this.redirectOriginUrl = param['origin'];
    });

    this.contexteService.getCurrentUser().subscribe((user) => {
      user?.roles?.forEach((roleUser) => {
        switch (roleUser.code) {
          case this.GUEST:
            this.prices.find(
              (price) => price.type === this.GUEST
            )!.buttonDisplayed$ = this.contexteService.isNotAuthenticated();
            break;
          case this.TIER1:
            this.prices.find(
              (price) => price.type === this.TIER1
            )!.buttonDisplayed$ = user.roles?.find(
              (role) => (role.id = RoleTier1.id)
            )
              ? of(false)
              : of(true);
            break;
          case this.TIER2:
            this.prices.find((price) => price.type === this.TIER2)!.link =
              user?.roles?.find((role) => (role.id = RoleTier2.id))
                ? 'Mettre à niveau'
                : "S'abonner";
            break;
          default:
            break;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptionRxjs.unsubscribe();
  }

  redirectRegister(): void {
    this.dialogService.openDialog(CodeModaleEnum.SIGNUP);
  }

  subscribeTier1(): void {
    const dialRef = this.dialogService.openDialog(
      CodeModaleEnum.EXTERNAL_LINK,
      {
        url: 'https://datafood.lemonsqueezy.com/buy/10d8c623-2df5-48fc-aaf4-95f243906f43',
      }
    );

    this.callRefreshTokenOnPopinClosure(dialRef);
  }

  subscribeTier2(): void {
    const dialRef = this.dialogService.openDialog(
      CodeModaleEnum.EXTERNAL_LINK,
      {
        url: 'https://datafood.lemonsqueezy.com/buy/05bad941-d342-4ffa-85ce-5f0cf41be760',
      }
    );
    this.callRefreshTokenOnPopinClosure(dialRef);
  }

  callRefreshTokenOnPopinClosure(
    dialRef: MatDialogRef<Component | undefined, any>
  ): void {
    this.subscriptionRxjs.add(
      dialRef
        .afterClosed()
        .pipe(
          switchMap((_) =>
            this.refreshTokenService
              .refreshToken(this.tokenService.setRefreshTokenRequest(true))
              .pipe(
                tap((res) => {
                  this.authFrontService.logIn(res);
                  this.router.navigate([`/${this.redirectOriginUrl}`]);
                })
              )
          )
        )
        .subscribe()
    );
  }
}
