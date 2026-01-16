import { Component, effect, signal } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { TableGenericComponent } from '../../../shared/components/table-generic/table-generic.component';
import { StringUtils } from '../../../shared/utils/string.utils';
import { Member } from '../../../shared/models/member.model';
import { MembersService } from './member.service';
import {
  ColumnTypeParamEnum,
  TableColumnParamModel,
} from '../../../shared/models/table-column-param.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PaginatedDataSource } from '../../../shared/models/paginated-datasource';
import { MatTableDataSource } from '@angular/material/table';
import { ButtonParam } from '../../../shared/models/button-param';
import { ExpensesService } from './expenses.service';
import { Expense } from '../../../shared/models/expense.model';
import { ActivatedRoute } from '@angular/router';
import { BalancesComponent } from '../balances/balances.component';
import { MatOptionSelectionChange } from '@angular/material/core';
import { SelectCheckAllComponent } from '../../../shared/components/select-check-all/select-check-all.component';
import { Event } from '../../../shared/models/event.model';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-event-detail',
  imports: [
    MaterialModule,
    TableGenericComponent,
    FormsModule,
    ReactiveFormsModule,
    BalancesComponent,
    SelectCheckAllComponent,
  ],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.scss',
})
export class EventDetailComponent {
  readonly MEMBER_NAME = 'memberName';
  readonly MEMBER_COUNT = 'memberCount';

  readonly EXPENSE_NAME = 'expenseName';
  readonly EXPENSE_AMOUNT = 'expenseAmount';
  readonly EXPENSE_PAID_BY = 'expensePaidBy';
  readonly EXPENSE_MEMBERS_INVOLVED = 'expenseMembersInvolved';

  memberCreateForm?: FormGroup;
  expenseCreateForm?: FormGroup;

  get memeberNameControl(): FormControl {
    return this.memberCreateForm?.get(this.MEMBER_NAME) as FormControl;
  }

  get memberCountControl(): FormControl {
    return this.memberCreateForm?.get(this.MEMBER_COUNT) as FormControl;
  }

  get expenseNameControl(): FormControl {
    return this.expenseCreateForm?.get(this.EXPENSE_NAME) as FormControl;
  }

  get expenseAmountControl(): FormControl {
    return this.expenseCreateForm?.get(this.EXPENSE_AMOUNT) as FormControl;
  }

  get expensePaidByControl(): FormControl {
    return this.expenseCreateForm?.get(this.EXPENSE_PAID_BY) as FormControl;
  }

  get expenseMembersInvolvedControl(): FormControl {
    return this.expenseCreateForm?.get(
      this.EXPENSE_MEMBERS_INVOLVED
    ) as FormControl;
  }

  membersSignal = this.membersService.members;
  expensesSignal = this.expensesService.expenses;

  columnParamsMembers: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Nom',
      columDef: 'name',
      type: ColumnTypeParamEnum.STRING,
      footerLabel: 'Total',
    },
    {
      id: '2',
      label: 'Compte pour',
      columDef: 'count',
      type: ColumnTypeParamEnum.NUMBER,
      footerFunction: () =>
        this.membersService.getTotalMembersCount(
          this.activatedRoute.snapshot.params['id']
        ),
    },
    {
      id: '3',
      label: 'Actions',
      columDef: 'actions',
      type: ColumnTypeParamEnum.ACTIONS,
    },
  ];

  columnParamsExpenses: TableColumnParamModel[] = [
    {
      id: '1',
      label: 'Nom',
      columDef: 'name',
      type: ColumnTypeParamEnum.STRING,
      footerLabel: 'Total',
    },
    {
      id: '2',
      label: 'Montant',
      columDef: 'amount',
      type: ColumnTypeParamEnum.CURRENCY,
      footerFunction: () =>
        this.expensesService.getEventTotalExpenses(
          this.activatedRoute.snapshot.params['id']
        ),
    },
    {
      id: '3',
      label: 'Payé par',
      columDef: 'paidBy',
      type: ColumnTypeParamEnum.STRING,
    },
    {
      id: '4',
      label: 'Concerné(s)',
      columDef: 'membersInvolved',
      type: ColumnTypeParamEnum.CHIPS,
    },
    {
      id: '5',
      label: 'Part par membre',
      columDef: 'amountPerMember',
      type: ColumnTypeParamEnum.CURRENCY,
    },
    {
      id: '6',
      label: 'Actions',
      columDef: 'actions',
      type: ColumnTypeParamEnum.ACTIONS,
    },
  ];

  actionButtonsMember: ButtonParam[] = [
    {
      label: 'Supprimer',
      icon: 'trash-x',
      color: 'error',
      action: (row: any) => this.deleteMember(row),
    },
  ];

  actionButtonsExpense: ButtonParam[] = [
    {
      label: 'Supprimer',
      icon: 'trash-x',
      color: 'error',
      action: (row: any) => this.deleteExpense(row),
    },
  ];

  dataSourceMembers = new PaginatedDataSource<Member>();
  dataSourceExpenses = new PaginatedDataSource<Expense>();

  allSelected = false;
  selectedMembers: Member[] = [];

  event = new Event();

  constructor(
    private readonly eventService: EventsService,
    private readonly membersService: MembersService,
    private readonly expensesService: ExpensesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder
  ) {
    effect(() => {
      this.dataSourceMembers.dataSource = new MatTableDataSource<Member>(
        this.membersSignal()
      );
      this.dataSourceExpenses.dataSource = new MatTableDataSource<Expense>(
        this.expensesSignal()
      );
    });

    this.memberCreateForm = this.formBuilder.group({
      [this.MEMBER_NAME]: ['', [Validators.required]],
      [this.MEMBER_COUNT]: ['', [Validators.required]],
    });

    this.expenseCreateForm = this.formBuilder.group({
      [this.EXPENSE_NAME]: ['', [Validators.required]],
      [this.EXPENSE_AMOUNT]: ['', [Validators.required]],
      [this.EXPENSE_PAID_BY]: ['', [Validators.required]],
      [this.EXPENSE_MEMBERS_INVOLVED]: ['', [Validators.required]],
    });

    this.event = this.eventService.getEventById(
      this.activatedRoute.snapshot.params['id']
    )!;
  }

  createMember(): void {
    const member: Member = {
      id: StringUtils.replaceSpacesByDash(this.memeberNameControl.value).concat(
        Math.round(Math.random() * 1000000).toString()
      ),
      eventId: this.event.id,
      name: this.memeberNameControl.value,
      count: this.memberCountControl.value,
    };

    this.membersService.setMember(member);
  }

  createExpense(): void {
    const expense = {
      id: StringUtils.replaceSpacesByDash(this.expenseNameControl.value).concat(
        Math.round(Math.random() * 1000000).toString()
      ),
      eventId: this.event.id,
      name: this.expenseNameControl.value,
      amount: this.expenseAmountControl.value,
      paidBy: this.expensePaidByControl.value,
      membersInvolved: this.expenseMembersInvolvedControl.value,
    };

    this.expensesService.saveExpense(expense);
    const expenses = this.expensesService.getExpensesByEventId(this.event.id!);
    this.membersService.updateMemberBalance(expenses);
  }

  deleteMember(member: Member): void {
    this.membersService.deleteMember(member);
    this.expensesService.updateExpensesWhenMemberDeleted(
      member,
      this.event.id!
    );
    const expenses = this.expensesService.getExpensesByEventId(this.event.id!);
    this.membersService.updateMemberBalance(expenses);
  }

  deleteExpense(expense: Expense): void {
    this.expensesService.deleteExpense(expense);
    const expenses = this.expensesService.getExpensesByEventId(this.event.id!);
    this.membersService.updateMemberBalance(expenses);
  }

  compareCategoryObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
}
