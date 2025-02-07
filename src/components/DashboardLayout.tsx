import { AlertPanel } from "./AlertPanel";
import { CrimeMap } from "./CrimeMap";
import { DataAnalytics } from "./DataAnalytics";
import { HistoricalData } from "./HistoricalData";

export function DashboardLayout() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Crime Pattern Detection System
      </h1>
      <DataAnalytics />
      <div className="grid gap-4 md:grid-cols-2">
        <CrimeMap />
        <AlertPanel />
      </div>
      <HistoricalData />
    </div>
  );
}