import { Component, OnInit } from '@angular/core';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
