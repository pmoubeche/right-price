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
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-generic',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    PercentFormatPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './table-generic.component.html',
  styleUrl: './table-generic.component.scss',
})
export class TableGenericComponent<T> implements AfterViewInit, OnInit {
  readonly EDITABLE_FIELD = 'field';

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
  isEditableEnabled = false;

  editForm?: FormGroup;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private readonly formBuilder: FormBuilder,
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

  initForm(): void {
    this.editForm = this.formBuilder.group({
      [this.EDITABLE_FIELD]: [],
    });
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

  onEditField(): void {
    this.isEditableEnabled = true;
  }

  onValidateField(line: T, column: TableColumnParamModel, value: any): void {
    this.paginatedDataSource.dataSource.data.forEach((lineData) => {
      if (lineData === line) {
        const listCols = Object.getOwnPropertyNames(line);
        listCols.forEach((col) => {
          if (column.columDef === col) {
            // @ts-ignore
            lineData[column.columDef] = value;
          }
        });
      }
    });
    this.isEditableEnabled = false;
  }

  onDeleteElement(ligne: any) {
    this.paginatedDataSource.dataSource.data =
      this.paginatedDataSource.dataSource.data.filter((el) => el !== ligne);
  }
}
