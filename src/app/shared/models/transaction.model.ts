import { Member } from './member.model';

export class Transaction {
  id?: string;
  payeur?: Member;
  receveur?: Member;
  amount?: number;
}
