import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
} from 'chart.js';

export class ChartUtils {
  static setChartImports(): void {
    Chart.register(
      ArcElement,
      BarController,
      BarElement,
      CategoryScale,
      DoughnutController,
      LinearScale,
      LineController,
      LineElement,
      PieController,
      PointElement,
      PolarAreaController,
      RadarController,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale,
      Filler,
      Title,
      Tooltip,
      Legend
    );
  }

  static getCssVariableValue(key: string): string {
    const cssVariableMap: Record<string, string> = {
      primary: 'rgb(93, 135, 255)',
      secondary: 'rgb(68, 183, 247)',
      error: '--mat-sys-error',
      warning: '#ffae1f',
      success: '#13deb9',
      white: '#ffffff',
      dark: '#223742',
      light: '#d7dde2',
      lightPrimary: 'rgb(93, 135, 255, 0.5)',
      lightSecondary: 'rgb(68, 183, 247, 0.5)',
      lightWarning: '#ffad1f40',
      lightSuccess: '#13deb940',
      lightError: 'rgba(247, 68, 86, 0.5)',
    };
    const variableName = cssVariableMap[key] || key;

    if (variableName.startsWith('--mat')) {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
    } else {
      return variableName;
    }
  }
}
