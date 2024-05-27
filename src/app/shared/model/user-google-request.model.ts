import { RoleModel } from './role.model';

export class UserGoogleRequest {
  idGoogle?: string;
  familyName?: string;
  givenName?: string;
  email?: string;
  username?: string;
  emailVerified?: boolean;
  sessionExpiration?: number;
  roles?: RoleModel[];
}
