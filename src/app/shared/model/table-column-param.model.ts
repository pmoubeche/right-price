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
}
