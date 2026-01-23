export const UserRole = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const RoleGroups = {
  ADMIN_ONLY: [UserRole.ADMIN],
  USER_ONLY: [UserRole.USER],
  ALL_AUTHENTICATED: [UserRole.ADMIN, UserRole.USER],
} as const;

export interface User {
  clerkId: string;
  role: UserRole;
}
