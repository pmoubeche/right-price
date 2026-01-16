import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from '../../material/material.module';

@Component({
  standalone: true,
  selector: 'app-card',
  imports: [CommonModule, MaterialModule, TablerIconsModule],
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
  @Input() model: any;
  @Input() isClickable = false;
  @Input() hasActions? = false;

  @Input() displayFavoriteButton = true;
  @Input() displayDeleteFavoriteButton = false;

  @Output() cardClick = new EventEmitter<void>();
  @Output() relaodCards = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onClick(): void {
    if (this.isClickable) {
      this.cardClick.emit();
    }
  }
}
