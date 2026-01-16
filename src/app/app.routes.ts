import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { EventsComponent } from './features/events/events.component';
import { EventDetailComponent } from './features/events/event-detail/event-detail.component';
import { EventDetailResolver } from './shared/resolvers/event-detail.resolver';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'events',
    component: EventsComponent,
  },
  {
    path: 'events/:id',
    component: EventDetailComponent,
    resolve: { init: EventDetailResolver },
  },
  {
    path: '',
    component: HomeComponent,
  },
];
