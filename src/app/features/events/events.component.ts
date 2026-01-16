import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CardListComponent } from '../../shared/components/card-list/card-list.component';
import { MaterialModule } from '../../shared/material/material.module';
import { Event } from '../../shared/models/event.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../shared/services/dialog-generic.service';
import { EventsService } from './events.service';

@Component({
  selector: 'app-events',
  imports: [MaterialModule, TablerIconsModule, CardListComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnInit {
  events = this.eventService.events;
  constructor(
    private readonly dialogGenericService: DialogGenericService,
    private readonly eventService: EventsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  openCreateEventPopIn(): void {
    this.dialogGenericService.openDialog(CodeModaleEnum.CREATE_EVENT);
  }

  goToEvent(event: Event): void {
    this.router.navigate(['/events', event.id]);
  }
}
