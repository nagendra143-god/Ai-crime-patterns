
import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { data: userRoles, isLoading } = useQuery({
    queryKey: ["userRoles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      return data?.map(r => r.role) || [];
    }
  });

  if (isLoading) {
    return null;
  }

  if (!userRoles || !userRoles.some(role => allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
