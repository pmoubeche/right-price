import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import type {
  Chart,
  ChartData,
  ChartOptions,
  ChartType,
  UpdateMode,
} from 'chart.js';

@Component({
  standalone: true,
  selector: 'app-chart',
  template: `
    @if(this.isBrowser){
    <canvas #ref [attr.height]="height" [attr.width]="width"></canvas>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [':host { display: block }'],
})
export class ChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('ref') ref?: ElementRef<HTMLCanvasElement>;
  @Input() type!: ChartType;
  @Input() data!: ChartData;
  @Input() options!: ChartOptions;
  @Input() height = 50;
  @Input() width = 300;
  @Input() plugins?: any[];
  /** Force destroy and redraw on chart update */
  @Input() redraw?: boolean;
  @Input() updateMode?: UpdateMode;
  chartInstance!: Chart;

  public isBrowser?: boolean;

  constructor(private zone: NgZone, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges() {
    if (this.chartInstance && this.redraw) {
      this.chartInstance.destroy();
      this.renderChart();
      return;
    }

    this.updateChart();
  }

  updateChart() {
    if (!this.chartInstance) {
      return;
    }

    this.chartInstance.data = this.data;
    this.chartInstance.options = this.options;
    this.chartInstance.update(this.updateMode);
  }

  renderChart() {
    const node = this.ref?.nativeElement;

    this.zone.runOutsideAngular(async () => {
      const { Chart } = await import('chart.js');
      if (node !== undefined) {
        this.chartInstance = new Chart(node, {
          type: this.type,
          data: this.data,
          options: this.options,
          plugins: this.plugins,
        });
      }
    });
  }
}
