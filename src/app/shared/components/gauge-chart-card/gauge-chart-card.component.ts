import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MaterialModule } from '../../material/material.module';
import { RoundNumberDecimalPipe } from '../../pipes/round-number-decimal.pipe';
import { ChartComponent } from '../chart/chart.component';
import { ChartUtils } from '../chart/chart.utils';
import { CommonModule } from '@angular/common';

export class GaugeCardParams {
  title?: string;
  value?: number;
  unit?: string;
  valueMax?: number;
  color?: string;
  height?: number;
  width?: number;
}

@Component({
  standalone: true,
  selector: 'app-gauge-chart-card',
  imports: [
    MaterialModule,
    ChartComponent,
    RoundNumberDecimalPipe,
    CommonModule,
  ],
  templateUrl: './gauge-chart-card.component.html',
})
export class GaugeChartCardComponent implements OnInit {
  @Input() set gaugeCardParam(gaugeCardParam: GaugeCardParams) {
    this._gaugeCardParam = gaugeCardParam;
    this.gaugeChartData = this.setGaugeChartData(gaugeCardParam);
  }

  private _gaugeCardParam!: GaugeCardParams;

  get gaugeCardParam() {
    return this._gaugeCardParam;
  }

  gaugeChartData?: ChartData;

  options: ChartOptions<'doughnut'> = {
    cutout: '70%',
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        display: false,
      },
    },
  };

  ngOnInit(): void {
    ChartUtils.setChartImports();
  }

  setGaugeChartData(gaugeCardParam: GaugeCardParams): ChartData {
    return {
      labels: [gaugeCardParam.title, 'Valeur max'],
      datasets: [
        {
          data: [
            gaugeCardParam.value!,
            gaugeCardParam.valueMax! - gaugeCardParam.value!,
          ],
          backgroundColor: [
            this.gaugeCardParam.color,
            ChartUtils.getCssVariableValue('light'),
          ],
          rotation: 270,
          circumference: 180,
        },
      ],
    };
  }
}
