import { Component } from '@angular/core';
import { SidenavContentComponent } from '../../shared/components/sidenav-content/sidenav-content.component';
import { SidenavComponent } from '../../shared/components/sidenav/sidenav.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { MaterialModule } from '../../shared/material/material.module';

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
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
