import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlucoseMonitoringComponent } from './glucose-monitoring.component';

describe('GlucoseMonitoringComponent', () => {
  let component: GlucoseMonitoringComponent;
  let fixture: ComponentFixture<GlucoseMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlucoseMonitoringComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlucoseMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
