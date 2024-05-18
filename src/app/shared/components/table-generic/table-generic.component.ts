import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { of } from 'rxjs';
import { PaginatedDataSource } from '../../common/paginated-datasource';
import { MaterialModule } from '../../material/material.module';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../model/table-column-param.model';
import { PercentFormatPipe } from '../../pipes/percent-format.pipe';
import { TableGenericService } from './table-generic.service';
import { RouterLink } from '@angular/router';

export class UpdateData {
  element: any;
  formInputValue: any;
}

@Component({
  selector: 'app-table-generic',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    PercentFormatPipe,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
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

  @Output() onDeleteItem = new EventEmitter<T>();
  @Output() onValidateUpdateItem = new EventEmitter<UpdateData>();
  @Output() eventSelectLine = new EventEmitter<T>();

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  pageIndex?: number;
  loading = false;
  isEditableEnabled = false;

  editForm?: FormGroup;
  editModifyValue?: { columnDef: string; value: any };

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
      [this.EDITABLE_FIELD]: [this.editModifyValue?.value],
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
    this.eventSelectLine.next(row);
    this.tableGenericService.onSelectItem(row.idProduct);
  }

  onClickMoreActions(event: any) {
    event.stopPropagation();
  }

  onEditField(line: any, columns: any): void {
    if (Array.isArray(columns)) {
      columns.forEach((column) => {
        if (column.isEditable) {
          this.editModifyValue = {
            columnDef: column.columDef,
            value: line[column.columDef],
          };
        }
      });
    }
    this.initForm();
    line.isEditable = true;
    line.isEditable$ = of(line.isEditable);
  }

  onValidateUpdateField(line: T, event: any): void {
    event.stopPropagation();
    const data: UpdateData = {
      element: line,
      formInputValue: this.editForm?.get(this.EDITABLE_FIELD)!.value,
    };
    this.onValidateUpdateItem.next(data);
  }

  deleteElement(ligne: T): void {
    this.onDeleteItem.emit(ligne);
  }
}
