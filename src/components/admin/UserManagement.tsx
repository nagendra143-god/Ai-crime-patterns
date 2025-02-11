
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { UserRolesList } from "./UserRolesList";
import { type Role, type UserWithRoles } from "./types";

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: currentUserRoles, isLoading: loadingRoles } = useQuery({
    queryKey: ["userRoles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      return (data?.map(r => r.role) || []) as Role[];
    }
  });

  const isAdmin = currentUserRoles?.includes("admin");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: { users }, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;

        const userRoles = await Promise.all(
          users.map(async (user) => {
            const { data: roles } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", user.id);
            return {
              id: user.id,
              email: user.email || "",
              roles: (roles?.map((r) => r.role) || []) as Role[],
            };
          })
        );

        setUsers(userRoles);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, toast]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: newRole });

      if (error) throw error;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, roles: [...user.roles, newRole] }
            : user
        )
      );

      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (userId: string, roleToRemove: Role) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", roleToRemove);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                roles: user.roles.filter((role) => role !== roleToRemove),
              }
            : user
        )
      );

      toast({
        title: "Success",
        description: "Role removed successfully",
      });
    } catch (error) {
      console.error("Error removing role:", error);
      toast({
        title: "Error",
        description: "Failed to remove role",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingRoles) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <UserRolesList
          users={users}
          onRemoveRole={handleRemoveRole}
          onAddRole={handleRoleChange}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}
