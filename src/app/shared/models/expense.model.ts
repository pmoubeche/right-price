import { Member } from './member.model';

export class Expense {
  id?: string;
  eventId?: string;
  name?: string;
  amount?: number;
  paidBy?: Member;
  membersInvolved?: Member[];
  amountPerMember?: number;
}
