import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { BannerInfoModel, BannerService } from '../../../../generated';
import { MaterialModule } from '../../material/material.module';

@Component({
    selector: 'app-banner',
    imports: [MaterialModule, CommonModule],
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.scss'
})
export class BannerComponent implements OnInit, OnDestroy {
  bannerType?: string;
  isOpened?: boolean;
  icon?: string;
  bannerToDisplay?: BannerInfoModel;

  subscription = new Subscription();

  constructor(private readonly bannerSearchService: BannerService) {}

  ngOnInit(): void {
    this.getBanner();
  }

  getBanner() {
    this.subscription.add(
      this.bannerSearchService
        .getDisplayedBanner()
        .pipe(
          tap((res) => {
            if (res && res.id) {
              this.bannerToDisplay = res;
              this.isOpened = this.bannerToDisplay.isActive!;
              this.bannerType = this.bannerToDisplay.type;
            } else {
              this.isOpened = false;
            }
          })
        )
        .subscribe()
    );
  }

  closeBanner() {
    this.isOpened = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
