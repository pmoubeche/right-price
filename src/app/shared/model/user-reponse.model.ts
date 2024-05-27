import { RoleModel } from './role.model';

export class UserResponse {
  id?: string;
  username?: string;
  roles?: RoleModel[];
  accessToken?: string;
}
