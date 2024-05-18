export class TableColumnParamModel {
  id?: string;
  columDef?: string;
  label?: string;
  type?: string = '';
  icone?: string;
  colWidth?: string;
  padding?: string;
  isClickable?: boolean = false;
  isEditable?: boolean;
  applyStyleWithImage?: boolean = true;
}

export enum ColumnTypeParamEnum {
  STRING = 'string',
  NUMBER = 'number',
  IMAGE = 'image',
  DATE = 'date',
  PERCENT = 'percent',
  ACTIONS = 'actions',
}
