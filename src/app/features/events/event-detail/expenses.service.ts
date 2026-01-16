import { Injectable, signal } from '@angular/core';
import { Expense } from '../../../shared/models/expense.model';
import { MembersService } from './member.service';
import { Member } from '../../../shared/models/member.model';
import e from 'express';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  expenses = signal<Array<Expense>>([]);
  eventId?: string;

  constructor() {

  }

  setExpenseSignal(eventId:string): void {
    this.eventId = eventId
    const storedValue = JSON.parse(
      window.sessionStorage.getItem(`expenses-${eventId}`) || '[]'
    ) as Expense[];
    if (storedValue) {
      this.expenses.set(storedValue);
    }
  }

  getExpensesByEventId(eventId: string) {
    return this.expenses().filter((expense) => expense.eventId === eventId);
  }

  saveExpense(expense: Expense): void {
    const expenses = this.getExpensesByEventId(expense.eventId!);
    expense = this.setExpenseAmountPerMember(expense);
    expenses.push(expense);

    window.sessionStorage.setItem(`expenses-${this.eventId}`, JSON.stringify(expenses));
    this.expenses.set(expenses);
  }

  deleteExpense(expense: Expense): void {
    const expenses = this.expenses().filter((e) => e.id !== expense.id);
    window.sessionStorage.setItem(`expenses-${this.eventId}`, JSON.stringify(expenses));
    this.expenses.set(expenses);
  }

  getEventTotalExpenses(eventId: string): number {
    const expenses = this.getExpensesByEventId(eventId!);
    return expenses
      .filter((expense) => expense.eventId === eventId)
      .reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }

  getExpenseMemberCount(expense: Expense): number {
    return expense.membersInvolved!.reduce((acc, curr) => {
      return acc + curr?.count!;
    }, 0);
  }

  setExpenseAmountPerMember(expense: Expense): Expense {
    const numberOfMembers = this.getExpenseMemberCount(expense);
    return {
      ...expense,
      amountPerMember: expense.amount! / numberOfMembers,
    };
  }

  updateExpensesWhenMemberDeleted(member: Member, eventId: string): void {
    const expenses = this.getExpensesByEventId(eventId)
      // Supprimer les dépenses payées par le member
      .filter((expense) => expense.paidBy?.id !== member.id)
      // Retirer le member des membersInvolved
      .map((expense) => ({
        ...expense,
        membersInvolved: expense.membersInvolved?.filter(
          (m) => m.id !== member.id
        ),
        amountPerMember:
          expense.amount! /
          expense
            .membersInvolved!.filter((m) => m.id !== member.id)
            .map((m) => m.count)
            .reduce((acc, curr) => acc! + curr!, 0)!,
      }));

    sessionStorage.setItem(`expenses-${this.eventId}`, JSON.stringify(expenses));
    this.expenses.set(expenses);
  }
}
