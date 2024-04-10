import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../model/table-column-param.model';
import { PaginatedDataSource } from '../../common/paginated-datasource';
import { SearchProductComponent } from '../../../features/product/search-product/search-product.component';

@Component({
  selector: 'app-table-generic',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './table-generic.component.html',
  styleUrl: './table-generic.component.css',
})
export class TableGenericComponent<T> implements AfterViewInit {
  public columnTypeEnum = ColumnTypeParamEnum;

  private _columns?: TableColumnParamModel[];

  @Input() set columns(columns) {
    if (columns) {
      this._columns = columns;
      this.displayedColumns = this.columns.map((col) => col.columDef);
    }
  }

  get columns(): Array<TableColumnParamModel> {
    return this._columns!;
  }

  displayedColumns: (string | undefined)[] = [];
  @Input() paginatedDataSource = new PaginatedDataSource<T>();

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  pageIndex?: number;

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  ngAfterViewInit() {
    this.paginatedDataSource.dataSource.paginator = this.paginator!;
    this.paginatedDataSource.dataSource.sort = this.sort!;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onPageChange(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
  }
}
