import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../material/material.module';
import { Event } from '../../models/event.model';
import {
  CodeModaleEnum,
  DialogGenericService,
} from '../../services/dialog-generic.service';
import { randomUUID } from 'node:crypto';
import { StringUtils } from '../../utils/string.utils';
import { EventsService } from '../../../features/events/events.service';

@Component({
  standalone: true,
  selector: 'app-dialog-banner-edit',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TablerIconsModule,
  ],
  providers: [],
  templateUrl: './dialog-create-event.component.html',
})
export class DialogCreateEventComponent implements OnInit {
  readonly EVENT_NAME = 'eventName';

  eventCreateForm?: FormGroup;

  get eventNameControl(): FormControl {
    return this.eventCreateForm?.get(this.EVENT_NAME) as FormControl;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogGenericService: DialogGenericService,
    private readonly eventService: EventsService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.eventCreateForm = this.formBuilder.group({
      [this.EVENT_NAME]: ['', [Validators.required]],
    });
  }

  createOrUpdate(): void {
    const newEvent: Event = {
      id: StringUtils.replaceSpacesByDash(this.eventNameControl.value).concat(
        Math.round(Math.random() * 1000000).toString()
      ),
      name: this.eventNameControl.value,
    };
    this.eventService.saveEvent(newEvent);
    this.dialogGenericService.close(CodeModaleEnum.CREATE_EVENT);
  }

}
