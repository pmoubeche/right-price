import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastrService } from 'ngx-toastr';
import { Subscription, tap } from 'rxjs';
import { FavoriteFilterModel, FavoriteModel } from '../../../generated';
import { PageRequest } from '../../shared/common/paginated/page';
import { SearchFavoriteService } from '../../shared/common/paginated/search-favorite.service';
import { DialogGenericService } from '../../shared/components/dialogs/dialog-generic.service';
import { ProductCardListComponent } from '../../shared/components/product-card-list/product-card-list.component';
import { ProductCardListService } from '../../shared/components/product-card-list/product-card-list.service';
import {
  EcoscoreLinks,
  NovagroupLinks,
  NutriscoreLinks,
} from '../../shared/enum/svg-urls.enum';
import { MaterialModule } from '../../shared/material/material.module';
import { ProductInfosModel } from '../../shared/model/product-attribute-displayed.model';

@Component({
  standalone: true,
  selector: 'app-favorites',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    TablerIconsModule,
    ProductCardListComponent,
  ],
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent implements OnInit, OnDestroy {
  readonly NAME_FIELD = 'message';
  readonly DATE_CREATION_START_FIELD = 'dateCreationStart';
  readonly DATE_CREATION_END_FIELD = 'dateCreationEnd';
  readonly PRODUCT_ID_FIELD = 'productId';
  readonly NUTRISCORE_FIELD = 'nutriscore';
  readonly ECOSCORE_FIELD = 'ecoscore';
  readonly NOVAGROUP_FIELD = 'novagroup';
  readonly IS_ENABLED_FIELD = 'isEnabled';

  readonly NUTRISCORE_OPTIONS = Object.values(NutriscoreLinks);
  readonly ECOSCORE_OPTIONS = Object.values(EcoscoreLinks);
  readonly NOVAGROUP_OPTIONS = Object.values(NovagroupLinks);

  readonly STATUS_OPTIONS = [
    { value: '', label: 'Tous' },
    { value: true, label: 'Actif' },
    { value: false, label: 'Inactif' },
  ];

  get nameControl(): FormControl {
    return this.filterForm?.get(this.NAME_FIELD) as FormControl;
  }
  get dateCreationStartControl(): FormControl {
    return this.filterForm?.get(this.DATE_CREATION_START_FIELD) as FormControl;
  }
  get dateCreationEndControl(): FormControl {
    return this.filterForm?.get(this.DATE_CREATION_END_FIELD) as FormControl;
  }
  get productIdControl(): FormControl {
    return this.filterForm?.get(this.PRODUCT_ID_FIELD) as FormControl;
  }
  get nutriscoreControl(): FormControl {
    return this.filterForm?.get(this.NUTRISCORE_FIELD) as FormControl;
  }
  get ecoscoreControl(): FormControl {
    return this.filterForm?.get(this.ECOSCORE_FIELD) as FormControl;
  }
  get novagroupControl(): FormControl {
    return this.filterForm?.get(this.NOVAGROUP_FIELD) as FormControl;
  }
  get isEnabledControl(): FormControl {
    return this.filterForm?.get(this.IS_ENABLED_FIELD) as FormControl;
  }

  filterForm?: FormGroup;

  productInfos?: ProductInfosModel[];
  totalElements?: number;
  pageSize? = 24;
  pagesCount? = 0;
  pageSizeOptions? = [24];

  subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly favoriteSearchService: SearchFavoriteService,
    private readonly productCardListService: ProductCardListService,

    private readonly dialogService: DialogGenericService,
    private readonly snackbarService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.searchFavorite();
  }

  initForm(): void {
    this.filterForm = this.formBuilder.group({
      [this.NAME_FIELD]: [''],
      [this.DATE_CREATION_START_FIELD]: [''],
      [this.DATE_CREATION_END_FIELD]: [''],
      [this.PRODUCT_ID_FIELD]: [''],
      [this.NUTRISCORE_FIELD]: [''],
      [this.ECOSCORE_FIELD]: [''],
      [this.NOVAGROUP_FIELD]: [''],
      [this.IS_ENABLED_FIELD]: [''],
    });
  }

  searchFavorite(pageIndex: number = 0): void {
    const pageFavRequest: PageRequest<FavoriteModel> = {
      page: pageIndex, // Page 1 is index 0 !!!!
      size: 24,
      sort: { property: 'dateCreation', order: 'desc' },
    };

    const favoriteFilterModel: FavoriteFilterModel = {
      productId: this.productIdControl.value,
      productsId: undefined,
      name: this.nameControl.value,
      nutriscore: this.nutriscoreControl.value,
      ecoscore: this.ecoscoreControl.value,
      novagroup: this.novagroupControl.value,
      isEnabled: this.isEnabledControl.value,
      dateCreationStart:
        this.dateCreationStartControl.value === ''
          ? ''
          : this.dateCreationStartControl.value.toISOString(),
      dateCreationEnd:
        this.dateCreationEndControl.value === ''
          ? ''
          : this.dateCreationEndControl.value.toISOString(),
    };

    this.productCardListService.loadingBs.next(true);
    this.subscription.add(
      this.favoriteSearchService
        .page(pageFavRequest, favoriteFilterModel)
        .pipe(
          tap((res) => {
            this.totalElements = res.totalElements;
            this.pagesCount = res.size;
            this.pageSize = res.number;
            this.productInfos = res.content.map((fav) => {
              return {
                id: fav.productId,
                idFavorite: fav.id,
                isFavorite: fav.isEnabled,
                label: fav.name,
                image: fav.imageUrl,
                nutriscore: fav.nutriscore,
                ecoscore: fav.ecoscore,
                novagroup: fav.novagroup,
                dateCreation: fav.dateCreation,
              } as ProductInfosModel;
            });
            this.productCardListService.loadingBs.next(false);
          })
        )
        .subscribe()
    );
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  reinitFilters(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
