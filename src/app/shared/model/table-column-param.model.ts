export class TableColumnParamModel {
  id?: string;
  columDef?: string;
  label?: string;
  type?: string = '';
  icone?: string;
  colWidth?: string;
  isClickable?: boolean;
  applyStyleWithImage?: boolean = true;
}

export enum ColumnTypeParamEnum {
  STRING = 'string',
  NUMBER = 'number',
  IMAGE = 'image',
  DATE = 'date',
  PERCENT = 'percent',
}
