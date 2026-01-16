import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { EventsComponent } from '../events/events.component';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [MaterialModule, EventsComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}
