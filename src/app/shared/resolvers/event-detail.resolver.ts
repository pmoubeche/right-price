import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { MembersService } from '../../features/events/event-detail/member.service';
import { ExpensesService } from '../../features/events/event-detail/expenses.service';

@Injectable({ providedIn: 'root' })
export class EventDetailResolver implements Resolve<void> {
  constructor(
    private membersService: MembersService,
    private expenseService: ExpensesService
  ) {}

  resolve(route: ActivatedRouteSnapshot): void {
    const id = route.paramMap.get('id');
    if (id) {
      this.membersService.setMembersSignal(id);
      this.expenseService.setExpenseSignal(id);
    }
  }
}
