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
import { PaginatedDataSource } from '../../common/paginated/paginated-datasource';
import { MaterialModule } from '../../material/material.module';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../model/table-column-param.model';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { PercentFormatPipe } from '../../pipes/percent-format.pipe';
import { CardResultGenericService } from '../card-result-generic/card-result-generic.service';
import { TableGenericService } from './table-generic.service';
import { TablerIconsModule } from 'angular-tabler-icons';
import { TableChildrenLinePipe } from '../../pipes/table-children-line.pipe';
import { ButtonParam } from '../../model/button-param';

export class UpdateData {
  element: any;
  formInputValue: any;
}

@Component({
  standalone: true,
  selector: 'app-table-generic',
  imports: [
    MaterialModule,
    CommonModule,
    PercentFormatPipe,
    FormatDatePipe,
    TableChildrenLinePipe,
    ReactiveFormsModule,
    FormsModule,
    TablerIconsModule,
  ],
  templateUrl: './table-generic.component.html',
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
  @Input() buttons?: ButtonParam[];
  @Input() rowHeight?: string;
  @Input() isRowCentered = false;
  @Input() isPaginated = true;
  @Input() pageSizeOptions: number[] = [24];
  @Input() isSection = false;

  @Output() onValidateUpdateItem = new EventEmitter<UpdateData>();
  @Output() eventSelectLine = new EventEmitter<T>();
  @Output() eventPageSizeChange = new EventEmitter<number>();
  @Output() eventPageIndexChange = new EventEmitter<number>();

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  pageIndex?: number;
  loading = false;
  isEditableEnabled = false;

  chipOptions: string[] = [];

  editForm?: FormGroup;
  editModifyValue?: { columnDef: string; value: any };

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private readonly formBuilder: FormBuilder,
    private readonly tableGenericService: TableGenericService,
    private readonly cardGenericService: CardResultGenericService
  ) {}

  ngOnInit(): void {
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
    if (pageEvent.previousPageIndex !== pageEvent.pageIndex) {
      this.eventPageIndexChange.next(pageEvent.pageIndex);
    }

    if (this.paginatedDataSource.pageSize !== pageEvent.pageSize) {
      this.eventPageSizeChange.next(pageEvent.pageSize);
    }
  }

  onClickMoreActions(event: any) {
    event.stopPropagation();
  }

  onEditFieldOnTable(line: any, columns: any): void {
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
}
