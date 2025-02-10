
import { AlertPanel } from "./AlertPanel";
import { CrimeMap } from "./CrimeMap";
import { DataAnalytics } from "./DataAnalytics";
import { HistoricalData } from "./HistoricalData";
import { UserManagement } from "./admin/UserManagement";
import { RoleGuard } from "./RoleGuard";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";
import { LogOut } from "lucide-react";

export function DashboardLayout() {
  const { signOut } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">
          Crime Pattern Detection System
        </h1>
        <Button onClick={signOut} variant="outline" size="sm">
          <LogOut className="mr-2" />
          Logout
        </Button>
      </div>
      
      <RoleGuard allowedRoles={["admin"]}>
        <UserManagement />
      </RoleGuard>

      <DataAnalytics />
      <div className="grid gap-4 md:grid-cols-2">
        <CrimeMap />
        <AlertPanel />
      </div>
      <HistoricalData />
    </div>
  );
}
