import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMultipleAllComponent } from './select-multiple-all.component';

describe('SelectMultipleAllComponent', () => {
  let component: SelectMultipleAllComponent;
  let fixture: ComponentFixture<SelectMultipleAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectMultipleAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectMultipleAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
