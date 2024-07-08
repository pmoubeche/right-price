import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ContextService } from '../../services/context.service';
import { RoleAdmin, RoleTier1 } from '../../constants/role.constant';
import { MatSidenav } from '@angular/material/sidenav';
import { SideNavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenav') public sidenav?: MatSidenav;

  constructor(
    private readonly contextService: ContextService,
    private sideNavService: SideNavService
  ) {}

  isAuthorizedMealAccess = false;

  ngOnInit(): void {
    this.contextService.getCurrentUser().subscribe((user) => {
      this.isAuthorizedMealAccess =
        user?.roles?.map((role) => role.id)[0] === RoleAdmin.id ||
        user?.roles?.map((role) => role.id)[0] === RoleTier1.id;
    });
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      if (this.sidenav) {
        this.sidenav!.toggle();
      }
    });
  }
}
