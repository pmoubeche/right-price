import { Member } from '../models/member.model';

export class ListUtils {
  public static sortAsc(a: Member, b: Member) {
    if (a.balanceDifference === b.balanceDifference) {
      return 0;
    } else {
      return a.balanceDifference! < b.balanceDifference! ? -1 : 1;
    }
  }

  public static sortDesc(a: Member, b: Member) {
    if (a.balanceDifference === b.balanceDifference) {
      return 0;
    } else {
      return a.balanceDifference! > b.balanceDifference! ? -1 : 1;
    }
  }
}
