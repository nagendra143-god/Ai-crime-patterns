
import { AlertPanel } from "./AlertPanel";
import { CrimeMap } from "./CrimeMap";
import { DataAnalytics } from "./DataAnalytics";
import { HistoricalData } from "./HistoricalData";
import { UserManagement } from "./admin/UserManagement";
import { RoleGuard } from "./RoleGuard";
import { Button } from "./ui/button";
import { useAuth } from "./AuthProvider";
import { LogOut } from "lucide-react";
import { DataFlowDiagram } from "./DataFlowDiagram";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function DashboardLayout() {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="dataflow">System Data Flow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <RoleGuard allowedRoles={["admin"]}>
            <UserManagement />
          </RoleGuard>

          <DataAnalytics />
          <div className="grid gap-4 md:grid-cols-2">
            <CrimeMap />
            <AlertPanel />
          </div>
          <HistoricalData />
        </TabsContent>
        
        <TabsContent value="dataflow">
          <DataFlowDiagram />
        </TabsContent>
      </Tabs>
    </div>
  );
}
