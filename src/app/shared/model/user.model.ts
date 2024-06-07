import { RoleModel } from './role.model';

export class UserModel {
  id?: string;
  username?: string;
  email?: string;
  name?: string;
  firstname?: string;
  image?: string;
  roles?: RoleModel[];
  rolesStringList?: string[];
  height?: number;
  weight?: number;
  gender?: string;
  dateCreation?: Date;
  isActive?: boolean;
  origin?: string;
}

export class UserAdminModel {
  id?: string;
  username?: string;
  email?: string;
  name?: string;
  firstname?: string;
  password?: string;
  image?: string;
  roles?: RoleModel[];
  rolesStringList?: string[];
  height?: number;
  weight?: number;
  gender?: string;
  dateCreation?: Date;
  isActive?: boolean;
  origin?: string;
}

export class Gender {
  id?: string;
  label?: string;
}
