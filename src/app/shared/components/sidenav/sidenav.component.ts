import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { UserResponse } from '../../../../generated';
import { RoleGuest, RoleTier1, RoleTier2 } from '../../constants/role.constant';
import { MaterialModule } from '../../material/material.module';
import { ContextService } from '../../services/context.service';
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
  selector: 'app-sidenav',
  imports: [
    MaterialModule,
    RouterOutlet,
    NgScrollbarModule,
    CommonModule,
    TablerIconsModule,
  ],
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenav') public sidenav?: MatSidenav;

  items: ItemSidenav[] = [
    {
      title: 'Produits',
      icon: 'carrot',
      route: '/product',
      roleId: RoleGuest.id,
      availableGuest: true,
    },
    {
      title: 'Comparer',
      icon: 'arrows-left-right',
      route: '/compare',
      roleId: RoleGuest.id,
      availableGuest: true,
    },
    {
      title: 'Repas',
      icon: 'tools-kitchen-2',
      route: '/meal',
      roleId: RoleTier1.id,
      availableGuest: false,
      enabled: false,
    },
    {
      title: 'Liste de courses',
      icon: 'playlist-add',
      route: '/grocery',
      roleId: RoleTier1.id,
      availableGuest: false,
      enabled: false,
    },
    {
      title: 'Glycémie',
      icon: 'chart-line',
      route: '/cgm',
      roleId: RoleTier2.id,
      availableGuest: false,
      enabled: false,
    },
  ];

  listItemsGuests: ItemSidenav[] = [];
  listItemsSuscribers: ItemSidenav[] = [];
  userRoleIds?: string[] = [];

  public user$ = this.contextService.getCurrentUser();

  currentUser?: UserResponse;

  constructor(
    public router: Router,
    private readonly contextService: ContextService,
    private sideNavService: SideNavService,
    private cdr: ChangeDetectorRef
  ) {}

  isDisabled = false;

  ngOnInit(): void {
    this.listItemsGuests = this.items.filter((item) => item.availableGuest);
    this.listItemsSuscribers = this.items.filter(
      (item) => !item.availableGuest
    );
    this.contextService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.listItemsSuscribers = this.listItemsSuscribers.map((item) => ({
          ...item,
          enabled: user.roles?.map((r) => r.id).includes(item.roleId!),
        }));
        this.cdr.detectChanges();
      } else {
        this.listItemsSuscribers = this.listItemsSuscribers.map((item) => ({
          ...item,
          enabled: false,
        }));
        this.cdr.detectChanges();
      }
    });
    this.sidenav?.toggle();
    this.sideNavService.sideNavToggleSubject.subscribe(() => {
      this.sidenav?.toggle();
    });
  }

  itemDisabled(user: UserResponse, item: ItemSidenav): boolean {
    return !user.roles?.map((r) => r.id).includes(item.roleId);
  }

  onItemSelected(item: ItemSidenav) {
    this.router.navigate([item.route]);
  }
}
