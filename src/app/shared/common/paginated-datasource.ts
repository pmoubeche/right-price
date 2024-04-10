import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

export class PaginatedDataSource<T> {
  count?: number;
  page?: number;
  pageCount?: number;
  pageSize?: number;
  dataSource = new MatTableDataSource<T>();
  nextPage?: () => void;
}
