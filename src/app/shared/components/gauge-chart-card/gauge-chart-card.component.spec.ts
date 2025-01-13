import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeChartCardComponent } from './gauge-chart-card.component';

describe('GaugeChartCardComponent', () => {
  let component: GaugeChartCardComponent;
  let fixture: ComponentFixture<GaugeChartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaugeChartCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaugeChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
