import { TestBed } from '@angular/core/testing';

import { TableGenericService } from './table-generic.service';

describe('TableGenericService', () => {
  let service: TableGenericService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableGenericService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
