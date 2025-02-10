
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./StatCard";
import { CrimeHistory } from "./CrimeHistory";
import { AddCrimeDialog } from "./crime/AddCrimeDialog";

export function DataAnalytics() {
  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Crime Analytics Dashboard</h2>
        <AddCrimeDialog />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Incidents"
          value="2,345"
          description="15% increase from last month"
        />
        <StatCard
          title="Response Time"
          value="4.2 min"
          description="2 min faster than average"
        />
        <StatCard
          title="Active Patrols"
          value="28"
          description="Coverage: 85% of target areas"
        />
        <StatCard
          title="Risk Level"
          value="Moderate"
          description="Decreased from High"
        />
      </div>
      <div className="mt-4">
        <CrimeHistory />
      </div>
    </div>
  );
}
