import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartDataset,
  DoughnutController,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { NutrimentsManConst } from '../../enum/recomandation-nutriment.enum';

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
      Title,
      Tooltip,
      Legend
    );
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

  static setValueFiller(key: string, ...dataSets: ChartDataset[]): number {
    const dailyRecos = Object.values(NutrimentsManConst);
    let valueToAdd = 0;

    const datasFromDataSets = dataSets.map((dataSet) => dataSet.data);

    valueToAdd =
      dailyRecos.find((ajr) => ajr.label === key)!.value -
      datasFromDataSets
        .map((data: any) => data[0])
        .reduce((sum, current) => sum + current, 0);

    if (valueToAdd < 0) {
      valueToAdd = 0;
    }

    return valueToAdd;
  }
}
