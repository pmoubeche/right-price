import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { SidenavContentComponent } from '../sidenav-content/sidenav-content.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MaterialModule, SidenavContentComponent, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
})
export class SidenavComponent {}
