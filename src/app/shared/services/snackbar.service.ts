import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(
    private readonly matSnackBar: MatSnackBar,
    private readonly toastr: ToastrService
  ) {}

  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
