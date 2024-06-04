import { RoleModel } from '../../role.model';

export class UserResponse {
  id?: string;
  googleId?: string;
  image?: string;
  username?: string;
  roles?: RoleModel[];
  accessToken?: string;
}
