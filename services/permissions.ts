export type Role = "admin" | "user";

export type Permission =
  | "projects:read"
  | "projects:create"
  | "projects:update"
  | "projects:delete"
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete";

const ROLE_PERMS: Record<Role, Permission[]> = {
  admin: [
    "projects:read",
    "projects:create",
    "projects:update",
    "projects:delete",
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
  ],
  user: [
    "projects:read",
    "projects:create",
    "projects:update",
    "projects:delete",
  ],
};

export function permissionsForRole(role: string): Permission[] {
  const r = (role || "user") as Role;
  return ROLE_PERMS[r] || ROLE_PERMS.user;
}

export function hasPermission(role: string, perm: Permission): boolean {
  return permissionsForRole(role).includes(perm);
}
