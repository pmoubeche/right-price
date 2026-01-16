import { Signal } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';

export class TableColumnParamModel {
  id?: string;
  columDef?: string;
  label?: string;
  type?: string = '';
  icone?: string;
  colWidth?: string;
  padding?: string;
  sortable?: boolean;
  isClickable?: boolean = false;
  isEditable?: boolean;
  applyStyleWithImage?: boolean = true;
  footerLabel?: string;
  footerFunction?: (...args: any[]) => any;
  chartConfig?: {
    type: ChartType;
    data: (row: any) => ChartData | null;
    options: ChartOptions;
    height?: number;
    width?: number;
  };
  constantValue?: any;
}

export enum ColumnTypeParamEnum {
  STRING = 'string',
  AVATAR = 'avatar',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  CHIPS = 'chips',
  IMAGE = 'image',
  DATE = 'date',
  PERCENT = 'percent',
  ACTIONS = 'actions',
  CURRENCY = 'currency',
  CHART = 'chart',
  CONSTANT = 'constant',
}
