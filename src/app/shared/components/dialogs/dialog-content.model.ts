import { Component } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export class DialogConfirmContentModel extends MatDialogConfig {
  component?: Component;
  icon?: string;
  color?: string;
  title?: string;
  message?: string;
  confirm?: () => void;
  isLoading$?: Observable<boolean>;
}

export class DialogContentModel extends MatDialogConfig {
  component?: Component;
  title?: string;
  message?: string;
  confirm?: () => void;
  isLoading$?: Observable<boolean>;
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
