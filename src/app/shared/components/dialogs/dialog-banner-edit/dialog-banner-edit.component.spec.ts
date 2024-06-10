import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSigninComponent } from './dialog-banner-edit.component';

describe('DialogSigninComponent', () => {
  let component: DialogSigninComponent;
  let fixture: ComponentFixture<DialogSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSigninComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
