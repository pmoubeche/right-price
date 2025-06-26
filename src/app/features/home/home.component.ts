import { Component } from '@angular/core';
import { SidenavComponent } from '../../shared/components/sidenav/sidenav.component';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
    selector: 'app-home',
    imports: [MaterialModule, ToolbarComponent, SidenavComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {}
