import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '../../../generated';
import { MaterialModule } from '../../shared/material/material.module';
import { AccountEditComponent } from './account-edit/account-edit.component';
import { ProfilEditComponent } from './profil-edit/profil-edit.component';

@Component({
  selector: 'app-settings',
  imports: [MaterialModule, ProfilEditComponent, AccountEditComponent],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  public user?: UserModel;
  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.user = this.activatedRoute.snapshot.data['user'];
  }
}
