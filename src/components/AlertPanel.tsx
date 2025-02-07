import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Alert {
  id: number;
  type: string;
  location: string;
  timestamp: string;
  severity: "high" | "medium" | "low";
}

const mockAlerts: Alert[] = [
  {
    id: 1,
    type: "Suspicious Activity",
    location: "Downtown Area",
    timestamp: "2 minutes ago",
    severity: "high",
  },
  {
    id: 2,
    type: "Traffic Violation",
    location: "Main Street",
    timestamp: "5 minutes ago",
    severity: "medium",
  },
  {
    id: 3,
    type: "Noise Complaint",
    location: "Residential Zone",
    timestamp: "10 minutes ago",
    severity: "low",
  },
];

export function AlertPanel() {
  return (
    <Card className="bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Recent Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg ${
                alert.severity === "high"
                  ? "bg-destructive/20 border-destructive/50"
                  : alert.severity === "medium"
                  ? "bg-accent border-accent/50"
                  : "bg-secondary border-secondary/50"
              } border`}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-sm text-foreground">
                  {alert.type}
                </h4>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    alert.severity === "high"
                      ? "bg-destructive text-destructive-foreground"
                      : alert.severity === "medium"
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{alert.location}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {alert.timestamp}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}