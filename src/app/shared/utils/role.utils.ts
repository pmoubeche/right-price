import { RoleGuest, RolesConstantsHierachy } from '../constants/role.constant';
import { RoleModel } from '../model/role.model';

export class RoleUtils {
  static getHighestRoleFromRoles(roles: RoleModel[]): RoleModel {
    for (const role of RolesConstantsHierachy) {
      if (roles.some((r) => r.id === role.id)) {
        return role;
      }
    }
    return RoleGuest;
  }
}
