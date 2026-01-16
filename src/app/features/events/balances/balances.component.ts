import { Component, computed, effect, Input, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartUtils } from '../../../shared/components/chart/chart.utils';
import { TableGenericComponent } from '../../../shared/components/table-generic/table-generic.component';
import { MaterialModule } from '../../../shared/material/material.module';
import { Member } from '../../../shared/models/member.model';
import { PaginatedDataSource } from '../../../shared/models/paginated-datasource';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../../shared/models/table-column-param.model';
import { MembersService } from '../event-detail/member.service';
import { Transaction } from '../../../shared/models/transaction.model';

export class ChartDatasetDataBalances {
  positive?: number;
  positiveLeft?: number;
  negative?: number;
  negativeLeft?: number;
}

@Component({
  selector: 'app-balances',
  imports: [MaterialModule, TableGenericComponent],
  templateUrl: './balances.component.html',
  styleUrl: './balances.component.scss',
})
export class BalancesComponent {
  @Input({ required: true }) membersSignal = signal<Member[]>([]);
  @Input({ required: true }) expensesSignal = signal<Member[]>([]);

  optionsBar: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    scales: {
      x: {
        display: false,
        stacked: true,
      },
      y: { display: false, stacked: true, position: 'left' },
    },
    plugins: {
      legend: {
        display: false,
      },
      // tooltip: {
      //   enabled: false,
      // },
    },
  };

  chartData = signal<(row: any) => ChartData | null>((row: any) => null);

  columnParamsMembers = computed<TableColumnParamModel[]>(() => [
    {
      id: '1',
      label: 'Nom',
      columDef: 'name',
      type: ColumnTypeParamEnum.STRING,
      footerLabel: 'Total',
    },
    {
      id: '2',
      label: 'Compte pour',
      columDef: 'count',
      type: ColumnTypeParamEnum.NUMBER,
      footerFunction: () => this.membersService.totalMembersCount(),
    },
    {
      id: '3',
      label: 'A pour part',
      columDef: 'amountOwned',
      type: ColumnTypeParamEnum.CURRENCY,
    },
    {
      id: '4',
      label: 'A payé',
      columDef: 'totalPaid',
      type: ColumnTypeParamEnum.CURRENCY,
      footerFunction: () => this.membersService.sumOfPaid(),
    },
    {
      id: '5',
      label: 'Différence',
      columDef: 'balanceDifference',
      type: ColumnTypeParamEnum.CURRENCY,
      footerFunction: () => this.membersService.sumOfBalances(),
    },
    {
      id: '6',
      label: '',
      columDef: 'balanceDifferenceGraph',
      type: ColumnTypeParamEnum.CHART,
      chartConfig: {
        type: 'bar',
        data: (member: Member) => this.buildChartDataForMember(member),
        options: this.optionsBar,
      },
      colWidth: '300px !important',
    },
  ]);

  columsParamsTransactions: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Payeur',
      columDef: 'payeur',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '2',
      label: '',
      columDef: 'ows',
      type: ColumnTypeParamEnum.CONSTANT,
      constantValue: 'doit à',
    },
    {
      id: '3',
      label: 'Receveur',
      columDef: 'receveur',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '4',
      label: 'Montant',
      columDef: 'amount',
      type: ColumnTypeParamEnum.CURRENCY,
    },
  ];

  dataSourceMembers = new PaginatedDataSource<Member>();
  dataSourceTransactions = new PaginatedDataSource<Transaction>();
  private chartDataCache = new Map<string, ChartData>();

  constructor(
    private readonly membersService: MembersService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    ChartUtils.setChartImports();
    effect(() => {
      this.membersSignal(); // dépendance
      this.chartDataCache.clear();
      this.dataSourceMembers.dataSource = new MatTableDataSource<Member>(
        this.membersSignal()
      );

      this.dataSourceTransactions.dataSource =
        new MatTableDataSource<Transaction>(
          this.getTransactions(
            this.membersSignal().map((m) => ({ ...m })) // Clone les membres pour ne pas modifier les différenciels originaux
          )
        );
    });
  }

  buildChartDataForMember = (member: Member): ChartData => {
    const cacheKey = member.id;

    if (this.chartDataCache.has(cacheKey!)) {
      return this.chartDataCache.get(cacheKey!)!;
    }

    const balances = this.getDataSetBalances(member);
    const isMaxPositive = this.isMaxPositiveBalance(member);
    const isMinNegative = this.isMinNegativeBalance(member);

    const chartData: ChartData = {
      labels: ['Balance'],
      datasets: [
        {
          label: 'Positif',
          data: [balances.positive ?? 0],
          backgroundColor: [ChartUtils.getCssVariableValue('success')],
          borderRadius: {
            topLeft: 0,
            topRight: isMaxPositive ? 15 : 0,
            bottomLeft: 0,
            bottomRight: isMaxPositive ? 15 : 0,
          },
          borderSkipped: false,
          barThickness: 10,
        },
        {
          label: 'Positif restant',
          data: [balances.positiveLeft ?? 0],
          backgroundColor: [ChartUtils.getCssVariableValue('light')],
          borderRadius: {
            topLeft: 0,
            topRight: 15,
            bottomLeft: 0,
            bottomRight: 15,
          },
          borderSkipped: false,
          barThickness: 10,
        },
        {
          label: 'Négatif',
          data: [balances.negative ?? 0],
          backgroundColor: [ChartUtils.getCssVariableValue('error')],
          borderRadius: {
            topLeft: 0,
            topRight: 0,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
          barThickness: 10,
        },
        {
          label: 'Négatif restant',
          data: [balances.negativeLeft ?? 0],
          backgroundColor: [ChartUtils.getCssVariableValue('light')],
          borderRadius: {
            topLeft: 15,
            topRight: 0,
            bottomLeft: 15,
            bottomRight: 0,
          },
          borderSkipped: false,
          barThickness: 10,
        },
      ],
    };

    this.chartDataCache.set(cacheKey!, chartData);
    return chartData;
  };

  getDataSetBalances(member: Member): ChartDatasetDataBalances {
    const absoluteMaxValue = Math.max(
      Math.abs(this.getMaxBalanceDifference()),
      Math.abs(this.getMinBalanceDifference())
    );

    const isMaxAbsoluteDiff =
      Math.abs(member.balanceDifference!) === absoluteMaxValue;

    if (member.balanceDifference! > 0) {
      return {
        positive: member.balanceDifference!,
        positiveLeft: isMaxAbsoluteDiff
          ? 0
          : absoluteMaxValue - member.balanceDifference!,
        negative: 0,
        negativeLeft: -absoluteMaxValue,
      };
    } else {
      return {
        positive: 0,
        positiveLeft: absoluteMaxValue,
        negative: member.balanceDifference!,
        negativeLeft: isMaxAbsoluteDiff
          ? 0
          : -absoluteMaxValue - member.balanceDifference!,
      };
    }
  }

  getMaxBalanceDifference(): number {
    return Math.max(...this.membersSignal().map((m) => m.balanceDifference!));
  }

  getMinBalanceDifference(): number {
    return Math.min(...this.membersSignal().map((m) => m.balanceDifference!));
  }

  isMaxPositiveBalance(member: Member): boolean {
    const maxPositiveBalance = this.getMaxBalanceDifference();
    return member.balanceDifference === maxPositiveBalance;
  }

  isMinNegativeBalance(member: Member): boolean {
    const minNegativeBalance = this.getMinBalanceDifference();
    return member.balanceDifference === minNegativeBalance;
  }

  getTransactions(members: Member[]): Transaction[] {
    const listPayeurs = members
      .filter((m) => m.balanceDifference! < 0)
      .sort((a, b) => b.balanceDifference! - a.balanceDifference!);
    const listReceveurs = members
      .filter((m) => m.balanceDifference! > 0)
      .sort((a, b) => a.balanceDifference! - b.balanceDifference!);

    const transactions: Transaction[] = [];

    for (let i = 0; i < listPayeurs.length; i++) {
      const payeur = listPayeurs[i];

      if (payeur.balanceDifference === 0) continue;

      for (let j = 0; j < listReceveurs.length; j++) {
        const receveur = listReceveurs[j];

        if (receveur.balanceDifference === 0) continue;

        const montantPayeur = -payeur.balanceDifference!;
        const montantReceveur = receveur.balanceDifference!;

        // Le payeur rembourse tout ou partiellement le receveur
        const montantTransaction = Math.min(montantPayeur, montantReceveur);

        transactions.push({
          payeur: payeur,
          receveur: receveur,
          amount: montantTransaction,
        });

        // Mise à jour des soldes
        payeur.balanceDifference! += montantTransaction;
        receveur.balanceDifference! -= montantTransaction;

        // Si le payeur est soldé, on passe au suivant
        if (payeur.balanceDifference === 0) break;
      }
    }
    return transactions.filter((t) => t.amount! > 0.1);
  }
}
