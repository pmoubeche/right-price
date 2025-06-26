import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';

@Component({
    selector: 'app-home',
    imports: [MaterialModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {}
