
export type Role = "admin" | "moderator" | "user";

export type UserWithRoles = {
  id: string;
  email: string;
  roles: Role[];
};
