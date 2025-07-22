import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';
import { FavoriteModel, FavoriteService } from '../../../../generated';
import { MaterialModule } from '../../material/material.module';
import { ProductInfosModel } from '../../model/product-attribute-displayed.model';
import { ContextService } from '../../services/context.service';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialogs/dialog-generic.service';

@Component({
  standalone: true,
  selector: 'app-card-product',
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './card-product.component.html',
})
export class CardProductComponent implements OnInit, OnDestroy {
  @Input() productInfoModel = new ProductInfosModel();
  @Input() isClickable = false;
  @Input() hasActions? = false;

  @Input() displayFavoriteButton = true;
  @Input() displayDeleteFavoriteButton = false;

  isAuth = false;

  @Output() cardClick = new EventEmitter<void>();
  @Output() relaodCards = new EventEmitter<void>();

  subscription = new Subscription();

  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly contextService: ContextService,
    private readonly dialogService: DialogGenericService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.contextService
      .isAuthenticated()
      .subscribe((isAuth) => (this.isAuth = isAuth));
  }

  onClick(): void {
    if (this.isClickable) {
      this.cardClick.emit();
    }
  }

  clickFav = (productInfoModel: ProductInfosModel, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isAuth) {
      this.dialogService.openDialog(CodeModaleEnum.SIGNIN);
    } else {
      const req: FavoriteModel = {
        id: productInfoModel.idFavorite,
        name: productInfoModel.label,
        nutriscore: productInfoModel.nutriscore,
        ecoscore: productInfoModel.ecoscore,
        novagroup: productInfoModel.novagroup,
        isEnabled: !productInfoModel.isFavorite,
        productId: productInfoModel.id,
        imageUrl: productInfoModel.image,
      };
      this.subscription.add(
        this.favoriteService
          .createOrUpdateFavorite(req)
          .pipe(
            tap((res) => {
              this.productInfoModel.isFavorite = res?.isEnabled;
              this.toastr.success(
                `${res.name} ${
                  res.isEnabled ? 'ajouté aux' : 'retiré des'
                } favoris`
              );
            }),
            catchError(() => {
              this.toastr.error('Une erreur est survenue');
              return EMPTY;
            })
          )
          .subscribe()
      );
    }
  };

  deleteFav = (productInfoModel: ProductInfosModel, event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    this.subscription.add(
      this.favoriteService
        .deleteFavorite(productInfoModel.idFavorite!)
        .pipe(
          tap(() => {
            this.productInfoModel.isFavorite = false;
            this.toastr.success('Favori supprimé');
            this.relaodCards.emit();
          }),
          catchError(() => {
            this.toastr.error('Une erreur est survenue');
            return EMPTY;
          })
        )
        .subscribe()
    );
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
