import { User } from '../../../model/user.model';

export class GetUsersModelResponse {
  users?: User[];
  size?: number;
  totalPage?: number;
  number?: number;
  totalElements?: number;
}
