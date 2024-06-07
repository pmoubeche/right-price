import { UserModel } from '../../../model/user.model';

export class GetUsersModelResponse {
  users?: UserModel[];
  size?: number;
  totalPage?: number;
  number?: number;
  totalElements?: number;
}
