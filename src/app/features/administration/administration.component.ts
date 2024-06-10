import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../shared/material/material.module';
import { UserAdminstrationComponent } from '../user-adminstration/user-adminstration.component';
import { BannerAdminastrationComponent } from './banner-adminastration/banner-adminastration.component';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    UserAdminstrationComponent,
    BannerAdminastrationComponent,
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss',
})
export class AdministrationComponent {}
