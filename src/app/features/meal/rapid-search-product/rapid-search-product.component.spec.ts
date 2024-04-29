import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapidSearchProductComponent } from './rapid-search-product.component';

describe('RapidSearchProductComponent', () => {
  let component: RapidSearchProductComponent;
  let fixture: ComponentFixture<RapidSearchProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapidSearchProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RapidSearchProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
