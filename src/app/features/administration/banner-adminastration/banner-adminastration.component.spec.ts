import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerAdminastrationComponent } from './banner-adminastration.component';

describe('BannerAdminastrationComponent', () => {
  let component: BannerAdminastrationComponent;
  let fixture: ComponentFixture<BannerAdminastrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerAdminastrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannerAdminastrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
