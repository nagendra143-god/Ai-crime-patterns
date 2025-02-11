
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Role } from "./types";

interface UserRoleActionsProps {
  userId: string;
  onAddRole: (userId: string, role: Role) => Promise<void>;
  loading: boolean;
}

export function UserRoleActions({ userId, onAddRole, loading }: UserRoleActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        disabled={loading}
        onValueChange={(value: Role) => onAddRole(userId, value)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Add role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="moderator">Moderator</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
    </div>
  );
}
