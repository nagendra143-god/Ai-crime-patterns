import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CrimeMap() {
  return (
    <Card className="bg-card h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Crime Hotspot Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] bg-accent rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">
            Map integration will be added in the next iteration
          </p>
        </div>
      </CardContent>
    </Card>
  );
}