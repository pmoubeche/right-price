import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { UserModel, UserService } from '../../../generated';
import { MaterialModule } from '../../shared/material/material.module';
import { ContextService } from '../../shared/services/context.service';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { ProfilEditComponent } from './profil-edit/profil-edit.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterLink,
    MaterialModule,
    ProfilEditComponent,
    AccountEditComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  public currentUser$ = this.contextService.getCurrentUser();
  public user?: UserModel;
  subscription = new Subscription();
  constructor(
    private readonly contextService: ContextService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = this.activatedRoute.snapshot.data['user'];
  }
}
