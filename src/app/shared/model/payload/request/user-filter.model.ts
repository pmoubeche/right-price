export interface UserFilterModel {
  username: string | null;
  name: string | null;
  firstname: string | null;
  email: string | null;
  roles: string[] | null;
  dateCreationStart: string | null;
  dateCreationEnd: string | null;
  origin: string | null;
  isActive: boolean | null;
}
