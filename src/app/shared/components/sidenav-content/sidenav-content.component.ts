import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-sidenav-content',
  standalone: true,
  imports: [MaterialModule, RouterOutlet],
  templateUrl: './sidenav-content.component.html',
  styleUrl: './sidenav-content.component.css',
})
export class SidenavContentComponent {}
