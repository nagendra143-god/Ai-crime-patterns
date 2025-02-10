
import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  showLoading?: boolean;
}

export function RoleGuard({ children, allowedRoles, showLoading = false }: RoleGuardProps) {
  const { user } = useAuth();

  const { data: userRoles, isLoading } = useQuery({
    queryKey: ["userRoles", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      return data?.map(r => r.role) || [];
    },
    enabled: !!user,
  });

  if (isLoading && showLoading) {
    return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
  }

  if (!userRoles || !userRoles.some(role => allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
