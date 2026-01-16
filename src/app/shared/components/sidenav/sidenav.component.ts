import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../material/material.module';
import { SideNavService } from '../../services/sidenav.service';

export class ItemSidenav {
  title?: string;
  icon?: string;
  route?: string;
  roleId?: string;
  availableGuest?: boolean;
  enabled?: boolean;
}

@Component({
  standalone: true,
  selector: 'app-sidenav',
  imports: [MaterialModule, RouterOutlet, CommonModule, TablerIconsModule],
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenav') public sidenav?: MatSidenav;

  items: ItemSidenav[] = [
    {
      title: 'Evènements',
      icon: 'calendar-event',
      route: '/events',
    },
  ];

  constructor(
    public router: Router,
    private sideNavService: SideNavService,
    private cdr: ChangeDetectorRef
  ) {}

  isDisabled = false;

  ngOnInit(): void {
    this.sidenav?.toggle();
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav?.toggle();
    });
  }

  onItemSelected(item: ItemSidenav) {
    this.router.navigate([item.route]);
  }
}
