import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMealProductComponent } from './chart-meal-product.component';

describe('ChartMealProductComponent', () => {
  let component: ChartMealProductComponent;
  let fixture: ComponentFixture<ChartMealProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartMealProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartMealProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
