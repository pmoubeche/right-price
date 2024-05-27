import { RoleModel } from './role.model';

export class UserResponse {
  id?: string;
  googleId?: string;
  googlePicture?: string;
  username?: string;
  roles?: RoleModel[];
  accessToken?: string;
}
