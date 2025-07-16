export class ButtonParam {
  label?: string;
  icon?: string;
  color?: string;
  isEditField?: boolean;
  action?: (...args: any[]) => void;
}
