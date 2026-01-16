import { effect, Injectable, signal } from '@angular/core';
import { Event } from '../../shared/models/event.model';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  events = signal<Array<Event>>([]);

  constructor(private readonly activatedRoute: ActivatedRoute) {
    const storedValue = JSON.parse(
      window.sessionStorage.getItem('events') || '[]'
    ) as Event[];
    if (storedValue) {
      this.events.set(storedValue);
    }
  }

  getEventById(eventId: string): Event | undefined {
    return this.events().find((event) => event.id === eventId);
  }

  saveEvent(event: Event): void {
    const events = this.events();
    events.push(event);
    window.sessionStorage.setItem('events', JSON.stringify(events));
    this.events.set(events);
  }
}
