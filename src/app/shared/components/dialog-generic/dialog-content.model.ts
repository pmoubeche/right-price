import { Component } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

export class DialogContentModel extends MatDialogConfig {
  component?: Component;
  title?: string;
  message?: string;
  buttons?: ButtonAction[];
}

export class ButtonAction {
  label?: string;
  color?: string;
  icon?: string;
  isCloseButton? = false;
  isIntialyFocused? = true;
  action?: () => void;
}
