import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartDataset,
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
import {
  NutrimentsManConst,
  NutrimentsWomanConst,
} from '../../enum/recomandation-nutriment.enum';

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

  static setDataSetFilledValue(...dataSets: ChartDataset[]): ChartDataset {
    const dailyRecos = Object.values(NutrimentsManConst);
    let valueToAdd = 0;

    let data: number[] = [];

    const datasFromDataSets = dataSets.map((dataSet) => dataSet.data);

    dailyRecos.forEach((dailyReco, index) => {
      valueToAdd =
        dailyReco.value -
        datasFromDataSets
          .map((data: any) => data[index])
          .reduce((sum, current) => sum + current, 0);

      if (valueToAdd < 0) {
        valueToAdd = 0;
      }

      data.push(valueToAdd);
    });

    const dataSetFiller: ChartDataset = {
      label: 'AJR',
      data: data,
      fill: true,
      backgroundColor: ['#f1f1f1'],
      borderColor: ['#9e9e9e'],
      borderRadius: 5,
    };

    return dataSetFiller;
  }

  static setValueFiller(
    isMaleReco: boolean,
    key: string,
    ...dataSets: ChartDataset[]
  ): number {
    const dailyRecos = isMaleReco
      ? Object.values(NutrimentsManConst)
      : Object.values(NutrimentsWomanConst);
    let valueToAdd = 0;

    const datasFromDataSets = dataSets.map((dataSet) => dataSet.data);

    valueToAdd =
      dailyRecos.find((ajr) => `${ajr.label} (${ajr.unit})` === key)!.value -
      datasFromDataSets
        .map((data: any) => data[0])
        .reduce((sum, current) => sum + current, 0);

    if (valueToAdd < 0) {
      valueToAdd = 0;
    }

    return valueToAdd;
  }

  static setValueFillerFull(isMaleReco: boolean, key: string): number {
    const dailyRecos = isMaleReco
      ? Object.values(NutrimentsManConst)
      : Object.values(NutrimentsWomanConst);
    return dailyRecos.find((reco) => `${reco.label} (${reco.unit})` === key)
      ?.value!;
  }
}
