import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { CardComponent } from '../card/card.component';
import { CardListService } from './card-list.service';

@Component({
  standalone: true,
  selector: 'app-card-list',
  imports: [MaterialModule, CommonModule, CardComponent],
  templateUrl: './card-list.component.html',
})
export class CardListComponent implements OnInit {
  public isError$ = this.productCardListService.getIsError();
  public isLoading$ = this.productCardListService.getIsLoading();

  @Input() set models(models: any[]) {
    if (models !== undefined) {
      this._models = models;
    }
  }

  get models(): any[] {
    return this._models;
  }

  _models!: any[];

  public pageIndex?: number = 0;

  @Output() onChangePage = new EventEmitter<PageEvent>();
  @Output() relaodCards = new EventEmitter<void>();

  public isSelectedCard?: boolean;

  @Input() isPaginated = true;
  @Input() totalElements?: number;
  @Input() pageSize? = 24;
  @Input() pageSizeOptions? = [24];
  @Input() displayDeleteFavoriteButton = false;

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private readonly productCardListService: CardListService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  onPageChange(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.onChangePage.emit(pageEvent);
  }

  onReloadCards(): void {
    this.relaodCards.emit();
  }

  onSelectItem(model?: any): void {
    this.router.navigate(['/events', model?.id]);
  }
}
