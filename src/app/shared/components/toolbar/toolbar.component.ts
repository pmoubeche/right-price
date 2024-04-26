import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { LoginGoogleComponent } from './login-google/login-google.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MaterialModule, LoginGoogleComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  constructor(private readonly router: Router) {}

  onClick(): void {
    this.router.navigate(['/home']);
  }
}
