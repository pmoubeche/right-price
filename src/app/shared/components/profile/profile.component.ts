import { CommonModule } from '@angular/common';
import { } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'ngx-avatars';
import { RoleAdmin } from '../../constants/role.constant';
import { MaterialModule } from '../../material/material.module';
import { RoleModel } from '../../model/role.model';
import { AuthServiceFront } from '../../services/auth-front.service';
import { ContextService } from '../../services/context.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-profile',
    imports: [
        MaterialModule,
        AvatarModule,
        CommonModule,
        RouterLink,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public user$ = this.contextService.getCurrentUser();

  constructor(
    private readonly contextService: ContextService,
    private readonly snackbarService: SnackbarService,
    private readonly authService: AuthServiceFront
  ) {}

  logOut(): void {
    this.authService.logOut();
    this.snackbarService.show('Vous êtes déconnecté');
  }

  hasUserAdminRole(roles?: RoleModel[]): boolean {
    return roles!.find((role) => role.id === RoleAdmin.id) ? true : false;
  }
}
