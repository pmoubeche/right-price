import { MatTableDataSource } from '@angular/material/table';

export class PaginatedDataSource<T> {
  length?: number;
  pageIndex?: number;
  pageCount?: number;
  pageSize?: number;
  dataSource = new MatTableDataSource<T>();
  footer?: T;
  nextPage?: () => void;
}
