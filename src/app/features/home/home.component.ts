import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { SidenavComponent } from '../../shared/components/sidenav/sidenav.component';
import { SidenavContentComponent } from '../../shared/components/sidenav-content/sidenav-content.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MaterialModule,
    ToolbarComponent,
    SidenavComponent,
    SidenavContentComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
