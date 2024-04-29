import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { PaginatedDataSource } from '../../common/paginated-datasource';
import { MaterialModule } from '../../material/material.module';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../model/table-column-param.model';
import { PercentFormatPipe } from '../../pipes/percent-format.pipe';
import { TableGenericService } from './table-generic.service';

@Component({
  selector: 'app-table-generic',
  standalone: true,
  imports: [MaterialModule, CommonModule, PercentFormatPipe],
  templateUrl: './table-generic.component.html',
  styleUrl: './table-generic.component.scss',
})
export class TableGenericComponent<T> implements AfterViewInit, OnInit {
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
  @Input() rowHeight?: string;
  @Input() isPaginated = true;
  @Input() isClickable = false;

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  pageIndex?: number;
  loading = false;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private readonly tableGenericService: TableGenericService
  ) {}

  ngOnInit(): void {
    this.tableGenericService.onPageIndexChange$.subscribe(
      (index) => (this.pageIndex = index)
    );
    this.tableGenericService.loading$.subscribe(
      (loading) => (this.loading = loading)
    );
  }

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
    this.tableGenericService.onPageChange(this.pageIndex);
  }

  onSelectItem(row: any): void {
    this.tableGenericService.onSelectItem(row.id);
  }
}
