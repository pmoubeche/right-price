import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, map, tap } from 'rxjs';
import {
  DateRangeFilter,
  MealProductInfoGenModel,
  ProductsService,
} from '../../../generated';
import { PaginatedDataSource } from '../../shared/common/paginated/paginated-datasource';
import { TableGenericComponent } from '../../shared/components/table-generic/table-generic.component';
import { MaterialModule } from '../../shared/material/material.module';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../shared/model/table-column-param.model';
import { DateUtils } from '../../shared/utils/date.utils';

@Component({
  selector: 'app-grocery-list',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableGenericComponent,
  ],
  providers: [
    provideNativeDateAdapter(),
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
  ],
  templateUrl: './grocery-list.component.html',
  styleUrl: './grocery-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class GroceryListComponent implements OnInit {
  selectedDateRange: DateRange<Date> | undefined;

  dates$: Observable<any> = this.activatedRoute.data.pipe(
    map((data) => data['dates'])
  );

  paramsColums: TableColumnParamModel[] = [
    {
      id: '1',
      columDef: 'imageProduct',
      label: 'Image',
      type: ColumnTypeParamEnum.IMAGE,
    },
    {
      id: '2',
      columDef: 'labelProduct',
      label: 'Libellé',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '3',
      columDef: 'nutriscore',
      label: 'Nutriscore ',
      type: ColumnTypeParamEnum.IMAGE,
    },
    {
      id: '4',
      columDef: 'quantity',
      label: 'Quantité (g)',
      type: ColumnTypeParamEnum.NUMBER,
    },
    {
      id: '5',
      columDef: 'quantityPackaging',
      label: 'Quantité Packaging',
      type: ColumnTypeParamEnum.NUMBER,
    },
    {
      id: '6',
      columDef: 'quantityUnits',
      label: "Nombre d'unités",
      type: ColumnTypeParamEnum.NUMBER,
    },
  ];

  isNoResultMessageDisplayed = true;

  productInfosPaginated = new PaginatedDataSource<MealProductInfoGenModel>();

  private subscription = new Subscription();

  constructor(
    private readonly productServiceApi: ProductsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  doGroceryList() {
    const filter: DateRangeFilter = {
      dateStart: DateUtils.formatDateMinus1(
        this.selectedDateRange?.start!
      ).toISOString(),
      dateEnd: DateUtils.formatDateMinus1(
        this.selectedDateRange?.end!
      ).toISOString(),
    };
    this.subscription.add(
      this.productServiceApi
        .getProductsInMealsByDateRange(filter)
        .pipe(
          tap((res) => {
            this.productInfosPaginated.dataSource =
              new MatTableDataSource<MealProductInfoGenModel>(res);
            if (res.length > 0) {
              this.isNoResultMessageDisplayed = false;
            } else {
              this.isNoResultMessageDisplayed = true;
            }
          })
        )
        .subscribe()
    );
  }

  setUnitValuePackage(quantity: number, quantityPackaging: number): number {
    return Math.ceil(quantity / quantityPackaging);
  }

  _onSelectedChange(date: Date): void {
    if (
      this.selectedDateRange &&
      this.selectedDateRange.start &&
      date > this.selectedDateRange.start &&
      !this.selectedDateRange.end
    ) {
      this.selectedDateRange = new DateRange(
        this.selectedDateRange.start,
        date
      );
    } else {
      this.selectedDateRange = new DateRange(date, null);
    }
  }

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let classApplied = '';
    this.dates$.subscribe((dates) => {
      const meDates = dates.map((date: any) => new Date(date));
      const index = meDates.findIndex(
        (x: any) =>
          new Date(x).toLocaleDateString() === date.toLocaleDateString()
      );
      if (index > -1) {
        if (meDates[index]) {
          classApplied = 'highlight-date';
        }
      }
      return classApplied;
    });
    return classApplied;
  };
}
