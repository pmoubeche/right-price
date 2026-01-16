import { computed, Injectable, signal } from '@angular/core';
import { Member } from '../../../shared/models/member.model';
import { Expense } from '../../../shared/models/expense.model';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  members = signal<Array<Member>>([]);
  eventId?: string;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  setMembersSignal(eventId: string) {
    this.eventId = eventId;
    const storedValue = JSON.parse(
      window.sessionStorage.getItem(`members-${eventId}`) || '[]'
    ) as Member[];
    if (storedValue) {
      this.members.set(storedValue);
    }
  }

  setEventId(eventId: string): void {
    this.eventId = eventId;
  }

  getMembersByEventId(eventId: string) {
    return this.members().filter((member) => member.eventId === eventId);
  }

  setMember(member: Member): void {
    const members = this.getMembersByEventId(member.eventId!);

    members.push(member);
    window.sessionStorage.setItem(
      `members-${member.eventId}`,
      JSON.stringify(members)
    );
    this.members.set(members);
  }

  deleteMember(member: Member): void {
    const members = this.members().filter((m) => m.id !== member.id);
    window.sessionStorage.setItem(
      `members-${member.eventId}`,
      JSON.stringify(members)
    );
    this.members.set(members);
  }

  updateMemberBalance(expenses: Expense[]): void {
    const members = this.setMembersBalance(expenses);
    window.sessionStorage.setItem(
      `members-${expenses[0].eventId}`,
      JSON.stringify(members)
    );
    this.members.set(members);
  }

  getTotalMembersCount(eventId: string): number {
    return this.getMembersByEventId(eventId).reduce(
      (acc, curr) => acc + (curr.count || 0),
      0
    );
  }

  getMemberAmountOwned(member: Member, expenses: Expense[]): number {
    return expenses
      .filter((exp) =>
        exp.membersInvolved?.map((m) => m.id).includes(member.id!)
      )
      .reduce(
        (acc, curr) => acc + (curr.amountPerMember || 0) * member.count!,
        0
      );
  }

  getMemberTotalPaid(member: Member, expenses: Expense[]): number {
    return expenses
      .filter((expense) => expense.paidBy?.id === member.id)
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }

  getMemberBalanceDifference(member: Member): number {
    return (member.totalPaid || 0) - (member.amountOwned || 0);
  }

  setMembersBalance(expenses: Expense[]): Member[] {
    var members = this.getMembersByEventId(expenses[0].eventId!);
    members = members.map((member) => {
      const tot = this.getMemberTotalPaid(member, expenses);
      const amntOwned = this.getMemberAmountOwned(member, expenses);
      const balDiff = tot - amntOwned;
      return {
        ...member,
        totalPaid: tot,
        amountOwned: amntOwned,
        balanceDifference: balDiff,
      };
    });

    return members;
  }

  //must be zero
  getSumOfMemberBalances(eventId: string): number {
    const members = this.getMembersByEventId(eventId);
    return members
      .map((member) => member.balanceDifference || 0)
      .reduce((acc, curr) => acc + curr, 0);
  }

  getSumOfMemberTotalPaid(eventId: string): number {
    const members = this.getMembersByEventId(eventId);
    return members
      .map((member) => member.totalPaid || 0)
      .reduce((acc, curr) => acc + curr, 0);
  }

  totalMembersCount = computed(() => this.getTotalMembersCount(this.eventId!));

  sumOfPaid = computed(() => this.getSumOfMemberTotalPaid(this.eventId!));

  sumOfBalances = computed(() => this.getSumOfMemberBalances(this.eventId!));
}
