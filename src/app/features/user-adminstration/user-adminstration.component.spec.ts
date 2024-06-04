import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminstrationComponent } from './user-adminstration.component';

describe('UserAdminstrationComponent', () => {
  let component: UserAdminstrationComponent;
  let fixture: ComponentFixture<UserAdminstrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAdminstrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserAdminstrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
