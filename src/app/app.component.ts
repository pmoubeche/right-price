import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { ContextService } from './shared/services/context.service';
import { TokenStorageService } from './shared/services/token-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'datafood_front';

  constructor(
    private readonly tokenService: TokenStorageService,
    private readonly contextService: ContextService
  ) {}

  ngOnInit(): void {
    if (!this.tokenService.isTokenExpired()) {
      this.contextService.setCurrentUser(this.tokenService.getUser());
    }
  }
}
