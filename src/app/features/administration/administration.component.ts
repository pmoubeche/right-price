import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { UserAdminstrationComponent } from '../user-adminstration/user-adminstration.component';
import { BannerAdminastrationComponent } from './banner-adminastration/banner-adminastration.component';

@Component({
  standalone: true,
  selector: 'app-administration',
  imports: [
    MaterialModule,
    UserAdminstrationComponent,
    BannerAdminastrationComponent,
  ],
  templateUrl: './administration.component.html',
})
export class AdministrationComponent {}
