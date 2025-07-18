import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [MaterialModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
