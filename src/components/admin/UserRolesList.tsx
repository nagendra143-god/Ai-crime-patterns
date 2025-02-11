
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { type Role, type UserWithRoles } from "./types";
import { UserRoleActions } from "./UserRoleActions";

interface UserRolesListProps {
  users: UserWithRoles[];
  onRemoveRole: (userId: string, role: Role) => Promise<void>;
  onAddRole: (userId: string, role: Role) => Promise<void>;
  loading: boolean;
}

export function UserRolesList({ users, onRemoveRole, onAddRole, loading }: UserRolesListProps) {
  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{user.email}</p>
              <div className="flex gap-2 mt-2">
                {user.roles.map((role) => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {role}
                    <button
                      onClick={() => onRemoveRole(user.id, role)}
                      className="ml-1 hover:text-destructive"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <UserRoleActions
            userId={user.id}
            onAddRole={onAddRole}
            loading={loading}
          />
        </div>
      ))}
    </div>
  );
}
