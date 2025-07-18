import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { ToastrService } from 'ngx-toastr';
import { Subscription, tap } from 'rxjs';
import { RoleModel, UserResponse } from '../../../../generated';
import { SearchProductAutocompleteComponent } from '../../../features/product/search-product-autocomplete/search-product-autocomplete.component';
import { RoleAdmin, RoleTier1, RoleTier2 } from '../../constants/role.constant';
import { MaterialModule } from '../../material/material.module';
import { AuthServiceFront } from '../../services/auth-front.service';
import { ContextService } from '../../services/context.service';
import { SideNavService } from '../../services/sidenav.service';
import { BannerComponent } from '../banner/banner.component';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../dialogs/dialog-generic.service';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  standalone: true,
  selector: 'app-toolbar',
  imports: [
    MaterialModule,
    ProfileComponent,
    BannerComponent,
    RouterLink,
    CommonModule,
    SearchProductAutocompleteComponent,
    TablerIconsModule,
  ],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  public roleTier2 = RoleTier2;
  public roleTier1 = RoleTier1;
  public user$ = this.contextService.getCurrentUser();
  isUserSubscribed = false;

  subscription = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly sidebarService: SideNavService,
    private readonly contextService: ContextService,
    private readonly dialogService: DialogGenericService,
    private readonly authService: AuthServiceFront,
    private readonly snackbarService: ToastrService
  ) {}

  ngOnInit(): void {
    this.contextService.getCurrentUser().subscribe((userInfo) => {
      this.isUserSubscribed =
        userInfo?.roles?.map((role) => role.id).includes(RoleTier1.id)! ||
        userInfo?.roles?.map((role) => role.id).includes(RoleTier2.id)! ||
        userInfo?.roles?.map((role) => role.id).includes(RoleAdmin.id)!;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isRoleInUser(user: UserResponse, role: RoleModel): boolean {
    return user.roles?.map((r) => r.code).includes(role.code)!;
  }

  onClick(): void {
    this.router.navigate(['/home']);
  }

  login(): void {
    const dialRef = this.dialogService.openDialog(CodeModaleEnum.SIGNIN);

    this.subscription.add(
      dialRef
        .afterClosed()
        .pipe(
          tap((userRes) => {
            this.authService.logIn(userRes);
            this.snackbarService.success('Vous etes connecté');
          })
        )
        .subscribe()
    );
  }

  register(): void {
    const dialRef = this.dialogService.openDialog(CodeModaleEnum.SIGNUP);

    this.subscription.add(
      dialRef
        .afterClosed()
        .pipe(
          tap((userRes) => {
            this.authService.logIn(userRes);
            this.snackbarService.success('Vous etes connecté');
          })
        )
        .subscribe()
    );
  }

  triggerSidenav(): void {
    this.sidebarService.toggle();
  }
}
