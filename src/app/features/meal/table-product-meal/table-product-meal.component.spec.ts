import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProductMealComponent } from './table-product-meal.component';

describe('TableProductMealComponent', () => {
  let component: TableProductMealComponent;
  let fixture: ComponentFixture<TableProductMealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableProductMealComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableProductMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
