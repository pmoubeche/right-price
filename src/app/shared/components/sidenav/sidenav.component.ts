import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { SidenavContentComponent } from '../sidenav-content/sidenav-content.component';
import { RouterLink } from '@angular/router';
import { ContextService } from '../../services/context.service';
import { RoleAdmin, RoleTier1 } from '../../constants/role.constant';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MaterialModule, SidenavContentComponent, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  constructor(private readonly contextService: ContextService) {}

  isAuthorizedMealAccess = false;

  ngOnInit(): void {
    this.contextService.getCurrentUser().subscribe((user) => {
      this.isAuthorizedMealAccess =
        user?.roles?.map((role) => role.id)[0] === RoleAdmin.id ||
        user?.roles?.map((role) => role.id)[0] === RoleTier1.id;
    });
  }
}
