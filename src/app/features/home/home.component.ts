import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import {
  AuthService,
  PasswordResetRequest,
  ResetPasswordRequest,
} from '../../../generated';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [MaterialModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private readonly authService: AuthService) {}
  resetPwd() {
    this.authService
      .requestPasswordReset({ email: 'pierre.moubeche@gmail.com' })
      .subscribe(() => {
        console.log('request send');
      });
  }
}
