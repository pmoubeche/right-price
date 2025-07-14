import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private readonly matSnackBar: MatSnackBar) {}

  show(message: string): void {
    this.matSnackBar.open(message, 'success', {
      duration: 6000,
    });
  }
}
